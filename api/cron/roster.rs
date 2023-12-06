use std::collections::HashMap;
use std::time::SystemTime;
use serde_json::json;
use sqlx_oldapi::Executor;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};
use vercel_runtime::http::internal_server_error;
use menahq_api::{APIError, get_connection};
use menahq_api::datafeed::Datafeed;
use menahq_api::members::MembersResponse;
use menahq_api::models::{Model, User};
use menahq_api::roles::{ROLE_CONTROLLER_ID, ROLE_MEMBER_ID};

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

pub async fn handler(_req: Request) -> Result<Response<Body>, Error> {
    eprintln!("Roster update task started...");
    let full_start_time = SystemTime::now();
    let client = reqwest::Client::new();

    let vatsim_core_token = std::env::var("MENAHQ_API_VATSIM_CORE_API_TOKEN").unwrap();

    let start_time = SystemTime::now();
    eprintln!("[RosterUpdate] fetching roster from VATSIM");
    let r = match client.get("https://api.vatsim.net/v2/orgs/division/MENA?limit=10000").header("X-API-Key", &vatsim_core_token).send().await {
        Ok(r) => r,
        Err(e) => {
            return internal_server_error(APIError { code: "vatsim_core_api_error".to_string(), message: format!("VATSIM returned error: {}", e) })
        }
    };

    let division_home_roster: MembersResponse = match r.json().await {
        Ok(rj) => rj,
        Err(e) => {
            return internal_server_error(APIError { code: "vatsim_core_api_invalid".to_string(), message: format!("VATSIM response invalid: {}", e) })
        }
    };
    let duration = SystemTime::now().duration_since(start_time).unwrap().as_millis() as f64 / 1000.0;
    eprintln!("[RosterUpdate] ...done ({} seconds)", duration);

    let start_time = SystemTime::now();
    eprintln!("[RosterUpdate] loading datafile from VATSIM");
    let r = match client.get("https://data.vatsim.net/v3/vatsim-data.json").header("X-API-Key", &vatsim_core_token).send().await {
        Ok(r) => r,
        Err(e) => {
            return internal_server_error(APIError { code: "vatsim_data_api_error".to_string(), message: format!("VATSIM returned error: {}", e) })
        }
    };

    let datafeed: Datafeed = match r.json().await {
        Ok(rj) => rj,
        Err(e) => {
            return internal_server_error(APIError { code: "vatsim_data_api_invalid".to_string(), message: format!("VATSIM response invalid: {}", e) })
        }
    };
    let duration = SystemTime::now().duration_since(start_time).unwrap().as_millis() as f64 / 1000.0;
    eprintln!("[RosterUpdate] ...done ({} seconds)", duration);

    let mut controller_rating_hashmap = HashMap::new();
    for controller_rating in datafeed.ratings {
        controller_rating_hashmap.insert(controller_rating.id, (controller_rating.short, controller_rating.long));
    }
    let regions = HashMap::from([
        ("AMAS".to_string(), "Americas".to_string()),
        ("APAC".into(), "Asia Pacific".into()),
        ("EMEA".into(), "Europe, Middle East and Africa".into())
    ]);
    let divions = HashMap::from([
        ("MENA".to_string(), "Middle East and North Africa".to_string())
    ]);

    let mut pool = match get_connection().await {
        Ok(c) => c,
        Err(e) => {
            return internal_server_error(APIError { code: "pool_acquire_error".to_string(), message: format!("{}", e) })
        }
    };
    let mut conn = match pool.acquire().await {
        Ok(c) => c,
        Err(e) => {
            return internal_server_error(APIError { code: "conn_acquire_error".to_string(), message: format!("{}", e) })
        }
    };

    eprintln!("[RosterUpdate] loading existing users");
    conn.execute("BEGIN").await?;
    let mut existing_users_hashmap = HashMap::new();
    let all_existing_members = match sqlx_oldapi::query_as::<_, User>("SELECT * FROM users").fetch_all(&mut *conn).await {
        Ok(n) => n,
        Err(e) => {
            return internal_server_error(APIError { code: "find_users_error".to_string(), message: format!("{}", e) })
        }
    };
    for user in all_existing_members {
        existing_users_hashmap.insert(user.id.clone(), user);
    }
    conn.execute("COMMIT").await?;

    let mut updated = 0;

    for (no, member) in division_home_roster.items.iter().enumerate() {
        if member.rating == -1 {
            eprintln!("roster update skipping {}, suspended", member.id);
        }
        if member.name_first.is_none() || member.name_last.is_none() {
            eprintln!("update ignored {}, name unavailable", member.id);
            continue;
        }

        let user;
        if let Some(existing_member) = existing_users_hashmap.get(member.id.to_string().as_str()) {
            user = User {
                id: member.id.to_string(),
                name_first: member.name_first.clone().unwrap(),
                name_last: member.name_last.clone().unwrap(),
                name_full: format!("{} {}", member.name_first.clone().unwrap(), member.name_last.clone().unwrap()),
                controller_rating_id: member.rating as i32,
                controller_rating_short: controller_rating_hashmap.get(&member.rating).unwrap().0.clone(),
                controller_rating_long: controller_rating_hashmap.get(&member.rating).unwrap().1.clone(),
                pilot_rating_id: existing_member.pilot_rating_id,
                pilot_rating_short: existing_member.pilot_rating_short.clone(),
                pilot_rating_long: existing_member.pilot_rating_long.clone(),
                region_id: member.region_id.clone(),
                region_name: regions.get(&member.region_id).clone().unwrap().clone(),
                division_id: member.division_id.clone(),
                division_name: regions.get(&member.division_id).clone().unwrap_or(&member.division_id.to_string()).clone(),
                subdivision_id: member.subdivision_id.clone(),
                subdivision_name: None,
                role: existing_member.role.clone(),
                vacc: existing_member.vacc.clone(),
            };
            if user != *existing_member {
                eprintln!("updating {} #{}/{} {:?} {:?}", member.id, no, division_home_roster.count, member.name_first, member.name_last);
                match user.upsert(&mut conn).await {
                    Ok(u) => u,
                    Err(e) => {
                        return internal_server_error(APIError { code: "user_upsert_error".to_string(), message: format!("{}", e) })
                    }
                };
                updated += 1;
            }
        } else {
            if member.division_id != "MENA" {
                continue;
            }
            user = User {
                id: member.id.to_string(),
                name_first: member.name_first.clone().unwrap(),
                name_last: member.name_last.clone().unwrap(),
                name_full: format!("{} {}", member.name_first.clone().unwrap(), member.name_last.clone().unwrap()),
                controller_rating_id: member.rating as i32,
                controller_rating_short: controller_rating_hashmap.get(&member.rating).unwrap().0.clone(),
                controller_rating_long: controller_rating_hashmap.get(&member.rating).unwrap().1.clone(),
                pilot_rating_id: -1,
                pilot_rating_short: "INAC".to_string(),
                pilot_rating_long: "Inactive".to_string(),
                region_id: member.region_id.clone(),
                region_name: regions.get(&member.region_id).clone().unwrap().clone(),
                division_id: member.division_id.clone(),
                division_name: regions.get(&member.division_id).clone().unwrap_or(&member.division_id.clone()).clone(),
                subdivision_id: member.subdivision_id.clone(),
                subdivision_name: None,
                role: ROLE_CONTROLLER_ID.to_string(),
                vacc: None,
            };
            eprintln!("updating {} #{}/{} {:?} {:?}", member.id, no, division_home_roster.count, member.name_first, member.name_last);
            match user.upsert(&mut conn).await {
                Ok(u) => u,
                Err(e) => {
                    return internal_server_error(APIError { code: "user_upsert_error".to_string(), message: format!("{}", e) })
                }
            };
            updated += 1;
        }

    }

    let duration = SystemTime::now().duration_since(full_start_time).unwrap().as_millis() as f64 / 1000.0;

    eprintln!("Roster update completed {} users updated successfully in {} seconds", updated, duration);

    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(
            json!({})
                .to_string()
                .into(),
        )?)
}