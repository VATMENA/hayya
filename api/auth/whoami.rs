use menahq_api::models::{Role, User};
use menahq_api::{roles, user};
use serde::Serialize;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};

#[tokio::main]
async fn main() -> Result<(), Error> {
    simple_logger::init_with_env().unwrap();
    run(handler).await
}

#[derive(Serialize)]
struct WhoamiResponse {
    user: User,
    roles: Vec<Role>,
}

pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    let user = user!(&req);
    let roles = roles!(&req);

    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(serde_json::to_string(&WhoamiResponse { user, roles })?.into())?)
}
