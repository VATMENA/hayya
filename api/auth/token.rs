use log::info;
use menahq_api::audit_log::{now, Actor, ItemType};
use menahq_api::id::id;
use menahq_api::jwt::generate_token;
use menahq_api::models::{AuditLogEntry, Model, Role, User};
use menahq_api::roles::{ROLE_CONTROLLER_ID, ROLE_MEMBER_ID};
use menahq_api::{get_connection, APIError};
use serde::{Deserialize, Serialize};
use vercel_runtime::http::{bad_request, internal_server_error};
use vercel_runtime::{run, Body, Error, Request, RequestPayloadExt, Response, StatusCode};

#[tokio::main]
async fn main() -> Result<(), Error> {
    simple_logger::init_with_env().unwrap();
    run(handler).await
}

#[derive(Debug, Deserialize, Serialize)]
struct ReqPayload {
    code: String,
    redirect_uri: String,
}

#[derive(Debug, Serialize)]
struct VatsimTokenRequestPayload {
    grant_type: String,
    client_id: String,
    client_secret: String,
    redirect_uri: String,
    code: String,
}
#[derive(Debug, Deserialize, Serialize)]
struct VatsimTokenResponse {
    access_token: String,
}
#[derive(Debug, Deserialize, Serialize)]
struct VatsimInfoResponse {
    data: VatsimUserResponse,
}
#[derive(Debug, Deserialize, Serialize)]
struct VatsimUserResponse {
    cid: String,
    personal: VatsimUserPersonal,
    vatsim: VatsimDetails,
}
#[derive(Debug, Deserialize, Serialize)]
struct VatsimUserPersonal {
    name_first: String,
    name_last: String,
    name_full: String,
}
#[derive(Debug, Deserialize, Serialize)]
struct VatsimRating {
    id: i64,
    short: String,
    long: String,
}
#[derive(Debug, Deserialize, Serialize)]
struct VatsimArea {
    id: Option<String>,
    name: Option<String>,
}
#[derive(Debug, Deserialize, Serialize)]
struct VatsimDetails {
    rating: VatsimRating,
    pilotrating: VatsimRating,
    region: VatsimArea,
    division: VatsimArea,
    subdivision: VatsimArea,
}
#[derive(Debug, Serialize)]
struct TokenResponse {
    token: String,
    user: User,
}
pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    info!("debug: reading payload");
    let payload = match req.payload::<ReqPayload>() {
        Err(..) => {
            return bad_request(APIError {
                code: "invalid_payload".to_string(),
                message: "Invalid payload".to_string(),
            })
        }
        Ok(None) => {
            return bad_request(APIError {
                code: "missing_payload".to_string(),
                message: "Missing payload".to_string(),
            })
        }
        Ok(Some(p)) => p,
    };
    info!("debug: reading env vars");
    let endpoint = std::env::var("MENAHQ_API_VATSIM_OAUTH_ENDPOINT").unwrap();
    let client_id = std::env::var("MENAHQ_API_VATSIM_OAUTH_CLIENT_ID").unwrap();
    let client_secret = std::env::var("MENAHQ_API_VATSIM_OAUTH_CLIENT_SECRET").unwrap();

    let vatsim_req = VatsimTokenRequestPayload {
        grant_type: "authorization_code".to_string(),
        client_id,
        client_secret,
        redirect_uri: payload.redirect_uri,
        code: payload.code,
    };

    info!("debug: oauth: code -> token");

    let client = reqwest::Client::builder()
        .pool_max_idle_per_host(0)
        .build()?;

    let res = match client
        .post(format!("{}/oauth/token", endpoint))
        .form(&vatsim_req)
        .send()
        .await
    {
        Ok(res) => res,
        Err(e) => {
            return internal_server_error(APIError {
                code: "vatsim_token_connect_error".to_string(),
                message: format!("VATSIM returned error: {}", e),
            })
        }
    };
    if !res.status().is_success() {
        return internal_server_error(APIError {
            code: "vatsim_token_error_response".to_string(),
            message: format!("VATSIM returned error: {}", res.text().await.unwrap()),
        });
    }
    let response: VatsimTokenResponse = res.json().await.unwrap();

    info!("debug: oauth: token -> userinfo");

    let res = match client
        .get(format!("{}/api/user", endpoint))
        .bearer_auth(response.access_token)
        .send()
        .await
    {
        Ok(res) => res,
        Err(e) => {
            return internal_server_error(APIError {
                code: "vatsim_user_connect_error".to_string(),
                message: format!("VATSIM returned error: {}", e),
            })
        }
    };
    if !res.status().is_success() {
        return internal_server_error(APIError {
            code: "vatsim_user_error_response".to_string(),
            message: format!("VATSIM returned error: {}", res.text().await.unwrap()),
        });
    }
    let user_info: VatsimInfoResponse = res.json().await.unwrap();

    info!("debug: oauth exchange complete");
    info!("debug: connecting to database");

    // we need to find them in the database, if they exist
    // and if they dont, create them if their division is MENA
    let mut conn = match get_connection().await {
        Ok(conn) => conn,
        Err(e) => {
            return internal_server_error(APIError {
                code: "database_error_get_conn".to_string(),
                message: format!("database error: {}", e),
            })
        }
    };

    info!("debug: User::find");

    let maybe_user = match User::find(&user_info.data.cid, &mut conn).await {
        Ok(conn) => conn,
        Err(e) => {
            return internal_server_error(APIError {
                code: "database_error_find_user".to_string(),
                message: format!("database error: {}", e),
            })
        }
    };
    let user = match maybe_user {
        Some(existing_user) => existing_user,
        None => {
            let should_be_controller = user_info.data.vatsim.region.id == Some("EMEA".to_string())
                && user_info.data.vatsim.division.id == Some("MENA".to_string());
            let new_user = User {
                id: user_info.data.cid,
                name_first: user_info.data.personal.name_first,
                name_last: user_info.data.personal.name_last,
                name_full: user_info.data.personal.name_full,
                controller_rating_id: user_info.data.vatsim.rating.id as i32,
                controller_rating_short: user_info.data.vatsim.rating.short,
                controller_rating_long: user_info.data.vatsim.rating.long,
                pilot_rating_id: user_info.data.vatsim.pilotrating.id as i32,
                pilot_rating_short: user_info.data.vatsim.pilotrating.short,
                pilot_rating_long: user_info.data.vatsim.pilotrating.long,
                region_id: user_info.data.vatsim.region.id.unwrap(),
                region_name: user_info.data.vatsim.region.name.unwrap(),
                division_id: user_info.data.vatsim.division.id.unwrap(),
                division_name: user_info.data.vatsim.division.name.unwrap(),
                subdivision_id: user_info.data.vatsim.subdivision.id,
                subdivision_name: user_info.data.vatsim.subdivision.name,
                roles: if should_be_controller {
                    vec![ROLE_CONTROLLER_ID.to_string()]
                } else {
                    vec![ROLE_MEMBER_ID.to_string()]
                },
                vacc: None,
            };
            match new_user.upsert(&mut conn).await {
                Ok(_) => (),
                Err(e) => {
                    return internal_server_error(APIError {
                        code: "database_error_create_user".to_string(),
                        message: format!("database error: {}", e),
                    })
                }
            };
            let audit_log = AuditLogEntry {
                id: id(),
                timestamp: now(),
                actor: Actor::System.to_string(),
                item: ItemType::User(new_user.id.clone()).to_string(),
                before: None,
                after: Some(serde_json::to_value(&new_user).unwrap()),
                message: "Created new user".to_string(),
            };
            info!(
                "[AUDIT] {} @ {}. {} acted upon {}. Before: {:?}. After: {:?}. Message: {}",
                audit_log.id,
                audit_log.timestamp,
                audit_log.actor,
                audit_log.item,
                audit_log.before,
                audit_log.actor,
                audit_log.message
            );
            match audit_log.upsert(&mut conn).await {
                Ok(_) => (),
                Err(e) => {
                    return internal_server_error(APIError {
                        code: "database_error_create_user_log".to_string(),
                        message: format!("database error: {}", e),
                    })
                }
            };
            new_user.clone()
        }
    };

    let token = generate_token(&user);
    let audit_log = AuditLogEntry {
        id: id(),
        timestamp: now(),
        actor: Actor::User(user.id.clone()).to_string(),
        item: ItemType::User(user.id.clone()).to_string(),
        before: None,
        after: None,
        message: "Logged in on new session".to_string(),
    };
    info!(
        "[AUDIT] {} @ {}. {} acted upon {}. Before: {:?}. After: {:?}. Message: {}",
        audit_log.id,
        audit_log.timestamp,
        audit_log.actor,
        audit_log.item,
        audit_log.before,
        audit_log.actor,
        audit_log.message
    );
    match audit_log.upsert(&mut conn).await {
        Ok(_) => (),
        Err(e) => {
            return internal_server_error(APIError {
                code: "database_error_create_log".to_string(),
                message: format!("database error: {}", e),
            })
        }
    };

    let resp = TokenResponse { token, user };

    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(serde_json::to_string(&resp)?.into())?)
}
