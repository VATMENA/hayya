use crate::models::{Role, User};
use jwt_simple::algorithms::{Ed25519KeyPair, EdDSAKeyPairLike};
use jwt_simple::claims::Claims;
use jwt_simple::prelude::Duration;
use serde::{Deserialize, Serialize};

#[must_use]
#[allow(clippy::expect_used)] // these are fatal, unrecoverable errors. a panic ic okay here
pub fn get_keypair() -> Ed25519KeyPair {
    Ed25519KeyPair::from_bytes(
        &hex::decode(std::env::var("MENAHQ_API_ED25519_KEYPAIR").expect("required env var MENAHQ_API_ED25519_KEYPAIR is missing")).expect("MENAHQ_API_ED25519_KEYPAIR is invalid"),
    )
    .expect("MENAHQ_API_ED25519_KEYPAIR is invalid")
}

#[derive(Serialize, Deserialize, Debug)]
pub struct JwtData {
    pub user: User,
    pub roles: Vec<Role>,
}

#[must_use]
#[allow(clippy::expect_used)] // again, unrecoverable. panics ok
pub fn generate_token(user: &User, roles: &[Role]) -> String {
    let claims = Claims::with_custom_claims(
        JwtData {
            user: user.clone(),
            roles: roles.to_vec(),
        },
        Duration::from_days(180),
    );

    get_keypair().sign(claims).expect("signing of a JWT failed")
}
