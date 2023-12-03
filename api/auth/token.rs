use serde::{Deserialize, Serialize};
use serde_json::json;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode, RequestPayloadExt};
use vercel_runtime::http::{bad_request, internal_server_error};
use menahq_api::APIError;

#[derive(Debug, Deserialize, Serialize)]
struct ReqPayload {
    code: String,
    redirect_uri: String
}

#[derive(Debug, Serialize)]
struct VatsimTokenRequestPayload {
    grant_type: String,
    client_id: String,
    client_secret: String,
    redirect_uri: String,
    code: String
}
#[derive(Debug, Deserialize, Serialize)]
struct VatsimTokenResponse {
    access_token: String
}
#[derive(Debug, Deserialize, Serialize)]
struct VatsimInfoResponse {
    data: VatsimUserResponse
}
#[derive(Debug, Deserialize, Serialize)]
struct VatsimUserResponse {
    cid: String,
    personal: VatsimUserPersonal,
    vatsim: VatsimDetails
}
#[derive(Debug, Deserialize, Serialize)]
struct VatsimUserPersonal {
    name_first: String,
    name_last: String,
    name_full: String
}
#[derive(Debug, Deserialize, Serialize)]
struct VatsimRating {
    id: i64,
    short: String,
    long: String
}
#[derive(Debug, Deserialize, Serialize)]
struct VatsimArea {
    id: Option<String>,
    name: Option<String>
}
#[derive(Debug, Deserialize, Serialize)]
struct VatsimDetails {
    rating: VatsimRating,
    pilotrating: VatsimRating,
    region: VatsimArea,
    division: VatsimArea,
    subdivision: VatsimArea
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    let payload = match req.payload::<ReqPayload>() {
        Err(..) => { return bad_request(APIError { code: "invalid_payload".to_string(), message: "Invalid payload".to_string() }) },
        Ok(None) => { return bad_request(APIError { code: "missing_payload".to_string(), message: "Missing payload".to_string() }) },
        Ok(Some(p)) => p
    };

    let endpoint = std::env::var("MENAHQ_API_VATSIM_OAUTH_ENDPOINT").unwrap();
    let client_id = std::env::var("MENAHQ_API_VATSIM_OAUTH_CLIENT_ID").unwrap();
    let client_secret = std::env::var("MENAHQ_API_VATSIM_OAUTH_CLIENT_SECRET").unwrap();

    let vatsim_req = VatsimTokenRequestPayload {
        grant_type: "authorization_code".to_string(),
        client_id,
        client_secret,
        redirect_uri: payload.redirect_uri,
        code: payload.code
    };

    let client = reqwest::Client::new();
    let res = match client.post(format!("{}/oauth/token", endpoint)).form(&vatsim_req).send().await {
        Ok(res) => res,
        Err(e) => {
            return internal_server_error(APIError { code: "vatsim_error_response".to_string(), message: format!("VATSIM returned error: {}", e) })
        }
    };
    if !res.status().is_success() {
        return internal_server_error(APIError { code: "vatsim_error_response".to_string(), message: format!("VATSIM returned error: {}", res.text().await.unwrap()) })
    }
    let response: VatsimTokenResponse = res.json().await.unwrap();

    let res = match client.get(format!("{}/api/user", endpoint)).bearer_auth(response.access_token).send().await {
        Ok(res) => res,
        Err(e) => {
            return internal_server_error(APIError { code: "vatsim_error_response".to_string(), message: format!("VATSIM returned error: {}", e) })
        }
    };
    if !res.status().is_success() {
        return internal_server_error(APIError { code: "vatsim_error_response".to_string(), message: format!("VATSIM returned error: {}", res.text().await.unwrap()) })
    }
    let response: VatsimInfoResponse = res.json().await.unwrap();

    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(serde_json::to_string(&response)?.into())?)
}