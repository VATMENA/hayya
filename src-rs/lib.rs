#![warn(clippy::pedantic)]
#![allow(clippy::missing_errors_doc)] // not applicable here
#![allow(clippy::missing_panics_doc)] // not applicable here
#![deny(clippy::unwrap_used)]
#![deny(clippy::expect_used)]
#![allow(clippy::module_name_repetitions)] // annoying

pub mod audit_log;
pub mod datafeed;
pub mod id;
pub mod jwt;
pub mod members;
pub mod models;
pub mod roles;
pub mod auth;
#[macro_use]
pub mod macros;

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

#[allow(clippy::expect_used)]
pub async fn get_connection() -> Result<PoolConnection<Postgres>, sqlx::Error> {
    if let Some(pool) = CELL.get() {
        let conn = pool.acquire().await?;
        Ok(conn)
    } else {
        let pool = PgPoolOptions::new()
            .max_connections(10)
            .connect(&std::env::var("MENAHQ_API_POSTGRES_URL").expect("required env MENAHQ_API_POSTGRES_URL is not set"))
            .await?;
        sqlx::migrate!().run(&pool).await?;
        CELL.set(pool).expect("unreachable");
        let pool = CELL.get().expect("unreachable");
        let conn = pool.acquire().await?;
        Ok(conn)
    }
}
