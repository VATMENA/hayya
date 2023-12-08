use jwt_simple::algorithms::EdDSAPublicKeyLike;
use log::{error, info};
use menahq_api::audit_log::{now, Actor, ItemType};
use menahq_api::id::id;
use menahq_api::jwt::{generate_token, get_keypair, JwtData};
use menahq_api::models::{AuditLogEntry, Model, Role, User};
use menahq_api::roles::{ROLE_CONTROLLER_ID, ROLE_MEMBER_ID};
use menahq_api::{get_connection, APIError};
use serde::{Deserialize, Serialize};
use vercel_runtime::http::{bad_request, internal_server_error, unauthorized};
use vercel_runtime::{run, Body, Error, Request, RequestPayloadExt, Response, StatusCode};

#[tokio::main]
async fn main() -> Result<(), Error> {
    simple_logger::init_with_env().unwrap();
    run(handler).await
}

#[derive(Debug, Deserialize, Serialize)]
struct ReqPayload {
    user: String,
    role: String
}

#[derive(Debug, Deserialize, Serialize)]
struct RespPayload {
    user: User,
    new_role: Role
}

pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    let payload = match req.payload::<ReqPayload>() {
        Err(e) => {
            return bad_request(APIError {
                code: "invalid_payload".to_string(),
                message: e.to_string(),
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

    let hdr = req.headers().get("X-HQ-Token");
    let token_data;
    if let Some(tkn) = hdr {
        let token = match tkn.to_str() {
            Ok(tok) => tok,
            Err(_) => {
                return unauthorized(APIError {
                    code: "unauthorized".to_string(),
                    message: "unauthorized (invalid X-HQ-Token)".to_string(),
                });
            }
        };
        let key = get_keypair().public_key();
        let claims = match key.verify_token::<JwtData>(token, None) {
            Ok(claims) => claims,
            Err(_) => {
                return unauthorized(APIError {
                    code: "unauthorized".to_string(),
                    message: "unauthorized (invalid X-HQ-Token)".to_string(),
                });
            }
        };
        token_data = claims.custom;
    } else {
        return unauthorized(APIError {
            code: "unauthorized".to_string(),
            message: "unauthorized (missing X-HQ-Token)".to_string(),
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

    let mut target_user = match User::find(&payload.user, &mut conn).await {
        Ok(Some(u)) => u,
        Ok(None) => {
            return bad_request(APIError {
                code: "user_missing".to_string(),
                message: "user does not exist".to_string()
            })
        },
        Err(e) => {
            return internal_server_error(APIError {
                code: "find_user_error".to_string(),
                message: format!("{}", e),
            })
        }
    };

    let target_role = match Role::find(&payload.role, &mut conn).await {
        Ok(Some(u)) => u,
        Ok(None) => {
            return bad_request(APIError {
                code: "role_missing".to_string(),
                message: "role does not exist".to_string()
            })
        },
        Err(e) => {
            return internal_server_error(APIError {
                code: "find_role_error".to_string(),
                message: format!("{}", e),
            })
        }
    };

    if target_user.role == target_role.id {
        return bad_request(APIError {
            code: "already_has_role".to_string(),
            message: "user already has target role".to_string()
        })
    }

    /*
    if !token_data.role.permissions.contains(&perm.to_string()) {
            return unauthorized(APIError {
                code: "unauthorized".to_string(),
                message: "unauthorized (missing needed permission)".to_string(),
            });
        }
     */

    let has_permission = token_data.role.permissions.contains(&"division.role.assign".to_string()) || (token_data.role.permissions.contains(&"vacc.role.assign".to_string()) && token_data.user.vacc == target_user.vacc);

    if !has_permission {
        return unauthorized(APIError {
            code: "unauthorized".to_string(),
            message: "unauthorized (missing needed permission)".to_string(),
        });
    }

    if !token_data.role.can_assign(&target_role) {
        return unauthorized(APIError {
            code: "too_many_permissions".to_string(),
            message: "cannot assign role with permissions that you do not have".to_string(),
        });
    }

    // alright, everything is gud so update the user

    let before_target_user = target_user.clone();

    target_user.role = target_role.id.clone();

    match target_user.upsert(&mut conn).await {
        Ok(_) => (),
        Err(e) => {
            return internal_server_error(APIError {
                code: "upsert_error".to_string(),
                message: format!("{}", e),
            })
        }
    }

    // and create the audit log entry
    let audit_log_entry = AuditLogEntry {
        id: id(),
        timestamp: now(),
        actor: Actor::User(token_data.user.id.clone()).to_string(),
        item: ItemType::User(target_user.id.clone()).to_string(),
        before: Some(serde_json::to_value(&before_target_user).unwrap()),
        after: Some(serde_json::to_value(&target_user).unwrap()),
        message: format!("Updated role"),
    };

    info!("[AUDIT] {} @ {}. {} acted upon {}. Before: {:?}. After: {:?}. Message: {}", audit_log_entry.id, audit_log_entry.timestamp, audit_log_entry.actor, audit_log_entry.item, audit_log_entry.before, audit_log_entry.actor, audit_log_entry.message);

    match audit_log_entry.upsert(&mut conn).await {
        Ok(_) => (),
        Err(e) => {
            return internal_server_error(APIError {
                code: "log_upsert_error".to_string(),
                message: format!("{}", e),
            })
        }
    }

    let resp = RespPayload {
        user: target_user,
        new_role: target_role,
    };

    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(serde_json::to_string(&resp)?.into())?)
}
