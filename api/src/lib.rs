use serde::Serialize;

#[derive(Serialize)]
pub struct APIError {
    pub message: String,
    pub code: String
}