use serde::Deserialize;

#[derive(Deserialize, Clone)]
pub struct MembersResponse {
    pub count: i64,
    pub items: Vec<Member>,
}

#[derive(Deserialize, Clone)]
pub struct Member {
    pub id: i64,
    pub name_first: Option<String>,
    pub name_last: Option<String>,
    pub email: Option<String>,
    pub rating: i64,
    pub pilotrating: Option<i64>,
    pub militaryrating: Option<i64>,
    pub susp_date: Option<String>,
    pub reg_date: String,
    pub region_id: String,
    pub division_id: String,
    pub subdivision_id: Option<String>,
    pub lastratingchange: Option<String>,
}
