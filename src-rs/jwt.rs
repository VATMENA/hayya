use jwt_simple::algorithms::{Ed25519KeyPair, EdDSAKeyPairLike};
use jwt_simple::claims::Claims;
use jwt_simple::prelude::Duration;
use serde::{Deserialize, Serialize};
use crate::models::{Role, User};

pub fn get_keypair() -> Ed25519KeyPair {
    Ed25519KeyPair::from_bytes(&hex::decode(std::env::var("MENAHQ_API_ED25519_KEYPAIR").unwrap()).unwrap()).unwrap()
}

#[derive(Serialize, Deserialize, Debug)]
pub struct JwtData {
    pub user: User,
    pub role: Role
}

pub fn generate_token(user: &User, role: &Role) -> String {
    let claims = Claims::with_custom_claims(JwtData { user: user.clone(), role: role.clone() }, Duration::from_days(180));
    let token = get_keypair().sign(claims).unwrap();
    token
}