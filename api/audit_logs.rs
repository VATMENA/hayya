use vercel_runtime::{Body, Error, Request, Response, run};
use vercel_runtime::http::unauthorized;
use menahq_api::APIError;
use menahq_api::jwt::{get_keypair, JwtData};
use jwt_simple::prelude::*;
pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    let hdr = req.headers().get("X-HQ-Token");
    let token_data;
    if let Some(tkn) = hdr {
        let token = match tkn.to_str() {
            Ok(tok) => tok,
            Err(_) => {
                return unauthorized(APIError { code: "unauthorized".to_string(), message: "unauthorized (invalid X-HQ-Token)".to_string() });
            }
        };
        let key = get_keypair().public_key();
        let claims = match key.verify_token::<JwtData>(token, None) {
            Ok(claims) => claims,
            Err(_) => {
                return unauthorized(APIError { code: "unauthorized".to_string(), message: "unauthorized (invalid X-HQ-Token)".to_string() });
            }
        };
        token_data = claims.custom;
    } else {
        return unauthorized(APIError { code: "unauthorized".to_string(), message: "unauthorized (missing X-HQ-Token)".to_string() });
    }

    let reqd_perms = ["system.log.view"];
    for perm in reqd_perms {
        if !token_data.role.permissions.contains(&perm.to_string()) {
            return unauthorized(APIError { code: "unauthorized".to_string(), message: "unauthorized (missing needed permission)".to_string() });
        }
    }

    todo!()
}