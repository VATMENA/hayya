use std::error::Error;
use jwt_simple::algorithms::EdDSAPublicKeyLike;
use vercel_runtime::Request;
use crate::get_connection;
use crate::jwt::{get_keypair, JwtData};
use crate::models::{Role, User};

pub async fn token(req: &Request) -> Result<Option<JwtData>, Box<dyn Error>> {
    let hdr = match req.headers().get("X-HQ-Token") {
        Some(hval) => hval,
        None => { return Ok(None); }
    };
    let strval = match hdr.to_str() {
        Ok(sval) => sval,
        Err(_) => { return Ok(None); /* it's an error with the user's input, not our code */ }
    };

    let keypair = get_keypair();

    let token = match keypair.public_key().verify_token::<JwtData>(strval, None) {
        Ok(c) => c,
        Err(_) => { return Ok(None); }
    };

    Ok(Some(token.custom))
}

pub async fn user(req: &Request) -> Result<Option<User>, Box<dyn Error>> {
    let tkn = match token(&req).await? {
        Some(tkn) => tkn,
        None => { return Ok(None); }
    };
    let mut conn = get_connection().await?;
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1").bind(tkn.user.id).fetch_one(conn.as_mut()).await?;
    Ok(Some(user))
}

pub async fn roles(req: &Request) -> Result<Option<Vec<Role>>, Box<dyn Error>> {
    let mut conn = get_connection().await?;
    let user = match user(&req).await? {
        Some(user) => user,
        None => { return Ok(None); }
    };

    let mut roles = vec![];

    for role in user.roles {
        roles.push(sqlx::query_as::<_, Role>("SELECT * FROM roles WHERE id = $1").bind(role).fetch_one(conn.as_mut()).await?);
    }

    Ok(Some(roles))
}


pub async fn get_permissions(req: &Request) -> Result<Option<Vec<String>>, Box<dyn Error>> {
    let roles = match roles(&req).await? {
        Some(ra) => ra,
        None => { return Ok(None); }
    };

    let mut all_permissions = vec![];

    for role in roles {
        all_permissions.append(&mut (role.permissions.clone()));
    }

    Ok(Some(all_permissions))
}

pub async fn can(req: &Request, perms: &[&str]) -> Result<bool, Box<dyn Error>> {
    let all_permissions = match get_permissions(req).await? {
        Some(perms) => perms,
        None => { return Ok(false); }
    };

    for req_perm in perms {
        if *req_perm == "loggedin" {
            continue;
        }
        let rq_owned = req_perm.to_string();
        if !all_permissions.contains(&rq_owned) {
            return Ok(false);
        }
    }

    Ok(true)
}