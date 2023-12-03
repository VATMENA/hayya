mod models;

use serde::Serialize;
use sqlx::{Pool, Postgres};
use sqlx::postgres::PgPoolOptions;

#[derive(Serialize)]
pub struct APIError {
    pub message: String,
    pub code: String
}

pub async fn get_connection() -> Result<Pool<Postgres>, sqlx::Error> {
    let pool = PgPoolOptions::new().max_connections(5).connect(&std::env::var("MENAHQ_API_POSTGRES_URL").unwrap()).await?;
    sqlx::migrate!().run(&pool).await?;
    Ok(pool)
}