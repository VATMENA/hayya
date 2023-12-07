use std::fmt::Display;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug)]
pub enum Actor {
    System,
    User(String),
}
impl Display for Actor {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let str = match self {
            Self::System => "system".to_string(),
            Self::User(id) => format!("user:{}", id),
        };
        write!(f, "{}", str)
    }
}

#[derive(Debug)]
pub enum ItemType {
    System,
    Role(String),
    Vacc(String),
    User(String),
}
impl Display for ItemType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let str = match self {
            Self::System => "system".to_string(),
            Self::Role(id) => format!("role:{}", id),
            Self::Vacc(id) => format!("vacc:{}", id),
            Self::User(id) => format!("user:{}", id),
        };
        write!(f, "{}", str)
    }
}

pub fn now() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64
}
