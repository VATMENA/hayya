use vercel_runtime::{bundled_api, run, Body, Error, Request, Response};

#[tokio::main]
async fn main() -> Result<(), Error> {
    simple_logger::init_with_env().unwrap();
    run(handler).await
}

#[bundled_api]
pub async fn handler(req: Request) -> Result<Response<Body>, Error> {}