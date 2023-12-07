use vercel_runtime::{Body, Error, Request, Response};
use vercel_runtime::http::{internal_server_error};
use menahq_api::{APIError, get_connection};
use menahq_api::jwt::{get_keypair, JwtData};
use jwt_simple::prelude::*;
use log::info;
use reqwest::StatusCode;
use sqlx::query_as;
use menahq_api::models::User;

fn can_view_extended_data(req: &Request) -> bool {
    let hdr = req.headers().get("X-HQ-Token");
    let token_data;
    if let Some(tkn) = hdr {
        let token = match tkn.to_str() {
            Ok(tok) => tok,
            Err(_) => {
                info!("Roster view not extended: invalid header");
                return false;
            }
        };
        let key = get_keypair().public_key();
        let claims = match key.verify_token::<JwtData>(token, None) {
            Ok(claims) => claims,
            Err(_) => {
                info!("Roster view not extended: invalid token");
                return false;
            }
        };
        token_data = claims.custom;
    } else {
        info!("Roster view not extended: header missing");
        return false;
    }

    let reqd_perms = ["division.roster.extended"];
    for perm in reqd_perms {
        if !token_data.role.permissions.contains(&perm.to_string()) {
            info!("Roster view not extended: missing perm {}", perm);
            return false;
        }
    }

    return true;
}

#[derive(Serialize)]
pub struct HomeUser {
    pub name_first: String,
    pub name_last: String,
    pub role: String,
    pub rating: String,
    pub vacc: Option<String>
}

#[derive(Serialize)]
pub struct HomeRoster {
    pub users: Vec<HomeUser>
}

pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    let can_view_extended_data = can_view_extended_data(&req);

    let mut conn = match get_connection().await {
        Ok(c) => c,
        Err(e) => {
            return internal_server_error(APIError { code: "pool_acquire_error".to_string(), message: format!("{}", e) })
        }
    };

    let users = match query_as::<_, User>("SELECT * FROM users WHERE division_id = $1 AND controller_rating_short <> $2").bind("MENA").bind("SUS").fetch_all(conn.as_mut()).await {
        Ok(u) => u,
        Err(e) => {
            return internal_server_error(APIError { code: "db_error".to_string(), message: format!("{}", e) })
        }
    };

    let mut roster = HomeRoster {
        users: vec![]
    };

    for user in users {
        if can_view_extended_data {
            roster.users.push(HomeUser {
                name_first: user.name_first,
                name_last: user.name_last,
                role: user.role,
                rating: user.controller_rating_short,
                vacc: user.vacc
            });
        } else {
            roster.users.push(HomeUser {
                name_first: user.name_first,
                name_last: format!("({})", user.id),
                role: user.role,
                rating: user.controller_rating_short,
                vacc: user.vacc
            })
        }
    }

    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(serde_json::to_string(&roster)?.into())?)
}