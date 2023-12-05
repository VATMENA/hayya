use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use sqlx::{Error, Executor, FromRow, PgConnection};

#[async_trait]
pub trait Model {
    async fn find(id: &str, conn: &mut PgConnection) -> Result<Option<Self>, Error> where Self: Sized;
    async fn create(&self, conn: &mut PgConnection) -> Result<(), Error>;
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, FromRow)]
pub struct Role {
    pub id: String,
    pub name: String,
    pub permissions: Vec<String>,
}

#[async_trait]
impl Model for Role {
    async fn find(id: &str, conn: &mut PgConnection) -> Result<Option<Role>, Error> {
        conn.execute("BEGIN").await?;

        let r = sqlx::query_as::<_, Role>("SELECT * FROM roles WHERE id = $1").bind(id).fetch_optional(&mut *conn).await?;

        conn.execute("COMMIT").await?;

        Ok(r)
    }
    async fn create(&self, conn: &mut PgConnection) -> Result<(), Error> {
        conn.execute("BEGIN").await?;
        sqlx::query("INSERT INTO roles (id, name, permissions) VALUES ($1, $2, $3)")
            .bind(&self.id)
            .bind(&self.name)
            .bind(&self.permissions)
            .execute(&mut *conn).await?;
        conn.execute("COMMIT").await?;
        Ok(())
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, FromRow)]
pub struct Vacc {
    pub id: String,
    pub name: String,
    pub website: String,
    pub contact_email: String,
}

#[async_trait]
impl Model for Vacc {
    async fn find(id: &str, conn: &mut PgConnection) -> Result<Option<Vacc>, Error> where Self: Sized {
        conn.execute("BEGIN").await?;
        let r = sqlx::query_as::<_, Vacc>("SELECT * FROM vaccs WHERE id = $1").bind(id).fetch_optional(&mut *conn).await?;
        conn.execute("COMMIT").await?;
        Ok(r)
    }
    async fn create(&self, conn: &mut PgConnection) -> Result<(), Error> {
        conn.execute("BEGIN").await?;
        sqlx::query("INSERT INTO vaccs (id, name, website, contact_email) VALUES ($1, $2, $3, $4)")
            .bind(&self.id)
            .bind(&self.name)
            .bind(&self.website)
            .bind(&self.contact_email)
            .execute(&mut *conn).await?;
        conn.execute("COMMIT").await?;
        Ok(())
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, FromRow)]
pub struct User {
    pub id: String,
    pub name_first: String,
    pub name_last: String,
    pub name_full: String,
    pub controller_rating_id: i32,
    pub controller_rating_short: String,
    pub controller_rating_long: String,
    pub pilot_rating_id: i32,
    pub pilot_rating_short: String,
    pub pilot_rating_long: String,
    pub region_id: String,
    pub region_name: String,
    pub division_id: String,
    pub division_name: String,
    pub subdivision_id: Option<String>,
    pub subdivision_name: Option<String>,

    pub role: String,
    pub vacc: Option<String>,
}

#[async_trait]
impl Model for User {
    async fn find(id: &str, conn: &mut PgConnection) -> Result<Option<User>, Error> where Self: Sized {
        conn.execute("BEGIN").await?;
        let r = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1").bind(id).fetch_optional(&mut *conn).await?;
        conn.execute("COMMIT").await?;
        Ok(r)
    }
    async fn create(&self, conn: &mut PgConnection) -> Result<(), Error> {
        conn.execute("BEGIN").await?;
        sqlx::query("INSERT INTO users (id, name_first, name_last, name_full, controller_rating_id, controller_rating_short, controller_rating_long, pilot_rating_id, pilot_rating_short, pilot_rating_long, region_id, region_name, division_id, division_name, subdivision_id, subdivision_name, role, vacc) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)")
            .bind(&self.id)
            .bind(&self.name_first)
            .bind(&self.name_last)
            .bind(&self.name_full)
            .bind(&self.controller_rating_id)
            .bind(&self.controller_rating_short)
            .bind(&self.controller_rating_long)
            .bind(&self.pilot_rating_id)
            .bind(&self.pilot_rating_short)
            .bind(&self.pilot_rating_long)
            .bind(&self.region_id)
            .bind(&self.region_name)
            .bind(&self.division_id)
            .bind(&self.division_name)
            .bind(&self.subdivision_id)
            .bind(&self.subdivision_name)
            .bind(&self.role)
            .bind(&self.vacc)
            .execute(&mut *conn).await?;
        conn.execute("COMMIT").await?;
        Ok(())
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, FromRow)]
pub struct AuditLogEntry {
    pub id: String,
    pub timestamp: i64,
    pub actor: String,
    pub item: String,
    pub before: Option<serde_json::Value>,
    pub after: Option<serde_json::Value>,
    pub message: String,
}

#[async_trait]
impl Model for AuditLogEntry {
    async fn find(id: &str, conn: &mut PgConnection) -> Result<Option<AuditLogEntry>, Error> where Self: Sized {
        conn.execute("BEGIN").await?;
        let r = sqlx::query_as::<_, AuditLogEntry>("SELECT * FROM audit_log_entries WHERE id = $1").bind(id).fetch_optional(&mut *conn).await?;
        conn.execute("COMMIT").await?;
        Ok(r)
    }

    async fn create(&self, conn: &mut PgConnection) -> Result<(), Error> {
        conn.execute("BEGIN").await?;
        sqlx::query("INSERT INTO audit_log_entries (id, timestamp, actor, item, before, after, message) VALUES ($1, $2, $3, $4, $5, $6, $7)")
            .bind(&self.id)
            .bind(&self.timestamp)
            .bind(&self.actor)
            .bind(&self.item)
            .bind(&self.before)
            .bind(&self.after)
            .bind(&self.message)
            .execute(&mut *conn).await?;
        conn.execute("COMMIT").await?;
        Ok(())
    }
}