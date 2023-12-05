pub mod models;
pub mod jwt;
pub mod audit_log;
pub mod id;
pub mod roles;

use serde::Serialize;
use sqlx_oldapi::{Pool, Postgres};
use sqlx_oldapi::postgres::PgPoolOptions;

#[derive(Serialize)]
pub struct APIError {
    pub message: String,
    pub code: String
}

pub async fn get_connection() -> Result<Pool<Postgres>, sqlx_oldapi::Error> {
    let pool = PgPoolOptions::new().max_connections(5).connect(&std::env::var("MENAHQ_API_POSTGRES_URL").unwrap()).await?;
    sqlx_oldapi::migrate!().run(&pool).await?;
    Ok(pool)
}