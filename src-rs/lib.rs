#![warn(clippy::pedantic)]

pub mod audit_log;
pub mod datafeed;
pub mod id;
pub mod jwt;
pub mod members;
pub mod models;
pub mod roles;

use serde::Serialize;
use sqlx::pool::PoolConnection;
use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};
use std::sync::OnceLock;

#[derive(Serialize)]
pub struct APIError {
    pub message: String,
    pub code: String,
}

static CELL: OnceLock<Pool<Postgres>> = OnceLock::new();

pub async fn get_connection() -> Result<PoolConnection<Postgres>, sqlx::Error> {
    if CELL.get().is_some() {
        let pool = CELL.get().unwrap();
        let conn = pool.acquire().await?;
        Ok(conn)
    } else {
        let pool = PgPoolOptions::new()
            .max_connections(10)
            .connect(&std::env::var("MENAHQ_API_POSTGRES_URL").unwrap())
            .await?;
        sqlx::migrate!().run(&pool).await?;
        CELL.set(pool).unwrap();
        let pool = CELL.get().unwrap();
        let conn = pool.acquire().await?;
        Ok(conn)
    }
}
