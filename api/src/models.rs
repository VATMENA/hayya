#[derive(Debug)]
pub struct Role {
    pub id: String,
    pub name: String,
    pub permissions: Vec<String>
}