use serde::Deserialize;

#[derive(Deserialize)]
pub struct Datafeed {
    pub ratings: Vec<DataRating>,
}

#[derive(Deserialize)]
pub struct DataRating {
    pub id: i64,
    pub short: String,
    pub long: String,
}
