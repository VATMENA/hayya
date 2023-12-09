use jwt_simple::algorithms::EdDSAPublicKeyLike;
use log::{info};
use menahq_api::audit_log::{now, Actor, ItemType};
use menahq_api::id::id;
use menahq_api::jwt::{get_keypair, JwtData};
use menahq_api::models::{AuditLogEntry, Model, Role, User};
use menahq_api::{get_connection, APIError};
use serde::{Deserialize, Serialize};
use vercel_runtime::http::{bad_request, internal_server_error, unauthorized};
use vercel_runtime::{run, Body, Error, Request, RequestPayloadExt, Response, StatusCode};

#[tokio::main]
#[allow(dead_code)] // ? not sure why this is triggered on these
async fn main() -> Result<(), Error> {
    simple_logger::init_with_env().unwrap();
    run(handler).await
}

#[derive(Debug, Deserialize, Serialize)]
struct ReqPayload {
    user: String,
    roles: Vec<String>
}

#[derive(Debug, Deserialize, Serialize)]
struct RespPayload {
    user: User,
    new_roles: Vec<Role>
}

#[allow(dead_code)] // ? not sure why this is triggered on these
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

    let mut target_roles = vec![];

    for role in &payload.roles {
        let target_role = match Role::find(role, &mut conn).await {
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

        let mut has_permission = false;

        for role in &token_data.roles {
            if role.permissions.contains(&"division.role.assign".to_string()) || (role.permissions.contains(&"vacc.role.assign".to_string()) && token_data.user.vacc == target_user.vacc) {
                has_permission = true;
                break;
            }
        }

        if !has_permission {
            return unauthorized(APIError {
                code: "unauthorized".to_string(),
                message: "unauthorized (missing needed permission)".to_string(),
            });
        }

        let mut can_assign = false;

        for role in &token_data.roles {
            if role.can_assign(&target_role) {
                can_assign = true;
                break;
            }
        }

        if !can_assign {
            return unauthorized(APIError {
                code: "too_many_permissions".to_string(),
                message: "cannot assign role with permissions that you do not have".to_string(),
            });
        }

        target_roles.push(target_role);
    }

    // alright, everything is gud so update the user


    let before_target_user = target_user.clone();

    target_user.roles = target_roles.iter().map(|u| u.id.clone()).collect();

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
        message: "Updated roles".to_string(),
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
        new_roles: target_roles,
    };

    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(serde_json::to_string(&resp)?.into())?)
}
