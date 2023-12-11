use jwt_simple::prelude::*;
use log::info;
use menahq_api::jwt::{get_keypair, JwtData};
use menahq_api::models::User;
use menahq_api::{can, get_connection, user, APIError};
use reqwest::{StatusCode, Url};
use sqlx::query_as;
use std::collections::HashMap;
use vercel_runtime::http::{bad_request, internal_server_error};
use vercel_runtime::{run, Body, Error, Request, Response};
#[tokio::main]
async fn main() -> Result<(), Error> {
    simple_logger::init_with_env().unwrap();
    run(handler).await
}

#[derive(Serialize)]
pub struct VaccHomeUser {
    pub cid: String,
    pub name_first: String,
    pub name_last: String,
    pub roles: Vec<String>,
    pub rating: String,
    pub vacc: Option<String>,
}

#[derive(Serialize)]
pub struct HomeRoster {
    pub users: Vec<VaccHomeUser>,
}

pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    let parsed_url = Url::parse(&req.uri().to_string()).unwrap();
    let hash_query: HashMap<String, String> = parsed_url.query_pairs().into_owned().collect();
    let id_key = hash_query.get("id");

    let vacc_id = match id_key {
        Some(i) => i,
        None => {
            return bad_request(APIError {
                message: "Query string is invalid".to_string(),
                code: "query_string_invalid".to_string(),
            });
        }
    };

    let has_divisionwide = can!(&req, &["division.roster.extended"]);
    let has_vaccwide = can!(&req, &["vacc.roster.extended"]);
    let actor = user!(&req);

    let mut conn = match get_connection().await {
        Ok(c) => c,
        Err(e) => {
            return internal_server_error(APIError {
                code: "pool_acquire_error".to_string(),
                message: format!("{}", e),
            })
        }
    };

    let users = match query_as::<_, User>(
        "SELECT * FROM users WHERE division_id = $1 AND controller_rating_short <> $2 AND vacc = $3",
    )
    .bind("MENA")
    .bind("SUS")
    .bind(vacc_id)
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

    let mut roster = HomeRoster { users: vec![] };

    for user in users {
        let extended_for_this_user = has_divisionwide || (has_vaccwide && user.vacc == actor.vacc);
        if extended_for_this_user {
            roster.users.push(VaccHomeUser {
                cid: user.id.clone(),
                name_first: user.name_first,
                name_last: user.name_last,
                roles: user.roles,
                rating: user.controller_rating_short,
                vacc: user.vacc,
            });
        } else {
            roster.users.push(VaccHomeUser {
                cid: user.id.clone(),
                name_first: user.name_first,
                name_last: format!("({})", user.id),
                roles: user.roles,
                rating: user.controller_rating_short,
                vacc: user.vacc,
            })
        }
    }

    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(serde_json::to_string(&roster)?.into())?)
}
