use jwt_simple::algorithms::EdDSAPublicKeyLike;
use menahq_api::jwt::{get_keypair, JwtData};
use menahq_api::models::Vacc;
use menahq_api::{get_connection, APIError};
use serde::Serialize;
use sqlx::query_as;
use vercel_runtime::http::{internal_server_error, unauthorized};
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};

#[tokio::main]
async fn main() -> Result<(), Error> {
    simple_logger::init_with_env().unwrap();
    run(handler).await
}

#[derive(Serialize)]
struct RespPayload {
    vaccs: Vec<Vacc>,
}

pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    let hdr = req.headers().get("X-HQ-Token");
    let token_data;
    if let Some(tkn) = hdr {
        let token = match tkn.to_str() {
            Ok(tok) => tok,
            Err(_) => {
                return unauthorized(APIError {
                    code: "unauthorized".to_string(),
                    message: "unauthorized".to_string(),
                });
            }
        };
        let key = get_keypair().public_key();
        let claims = match key.verify_token::<JwtData>(token, None) {
            Ok(claims) => claims,
            Err(e) => {
                return unauthorized(APIError {
                    code: "unauthorized".to_string(),
                    message: "unauthorized".to_string(),
                });
            }
        };
        token_data = claims.custom;
    } else {
        return unauthorized(APIError {
            code: "unauthorized".to_string(),
            message: "unauthorized".to_string(),
        });
    }

    let mut conn = match get_connection().await {
        Ok(c) => c,
        Err(e) => {
            return internal_server_error(APIError {
                code: "pool_acquire_error".to_string(),
                message: format!("{}", e),
            })
        }
    };

    let vaccs = match query_as::<_, Vacc>("SELECT * FROM vaccs")
        .fetch_all(conn.as_mut())
        .await
    {
        Ok(u) => u,
        Err(e) => {
            return internal_server_error(APIError {
                code: "db_error".to_string(),
                message: format!("{}", e),
            })
        }
    };

    // just need to be logged in
    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(serde_json::to_string(&RespPayload { vaccs })?.into())?)
}
