use crate::models::{Role, User};
use jwt_simple::algorithms::{Ed25519KeyPair, EdDSAKeyPairLike};
use jwt_simple::claims::Claims;
use jwt_simple::prelude::Duration;
use serde::{Deserialize, Serialize};

pub fn get_keypair() -> Ed25519KeyPair {
    Ed25519KeyPair::from_bytes(
        &hex::decode(std::env::var("MENAHQ_API_ED25519_KEYPAIR").unwrap()).unwrap(),
    )
    .unwrap()
}

#[derive(Serialize, Deserialize, Debug)]
pub struct JwtData {
    pub user: User,
    pub roles: Vec<Role>,
}

pub fn generate_token(user: &User, roles: &[Role]) -> String {
    let claims = Claims::with_custom_claims(
        JwtData {
            user: user.clone(),
            roles: roles.to_vec(),
        },
        Duration::from_days(180),
    );

    get_keypair().sign(claims).unwrap()
}
