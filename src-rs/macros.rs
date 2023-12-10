#[macro_export]
macro_rules! user {
    ($r:expr) => {
        {
        match ::menahq_api::auth::user($r).await {
            Ok(Some(user)) => user,
            Ok(None) => {
                return ::vercel_runtime::http::unauthorized($crate::APIError {
                    code: "unauthorized".to_string(),
                    message: "unauthorized".to_string()
                });
            },
            Err(e) => {
                return ::vercel_runtime::http::internal_server_error($crate::APIError {
                    code: "permcheck_error".to_string(),
                    message: format!("{}", e),
                })
            }
        }
            }
    };
}
#[macro_export]
macro_rules! roles {
    ($r:expr) => {
        {
        match ::menahq_api::auth::roles($r).await {
            Ok(Some(roles)) => roles,
            Ok(None) => {
                return ::vercel_runtime::http::unauthorized($crate::APIError {
                    code: "unauthorized".to_string(),
                    message: "unauthorized".to_string()
                });
            },
            Err(e) => {
                return ::vercel_runtime::http::internal_server_error($crate::APIError {
                    code: "permcheck_error".to_string(),
                    message: format!("{}", e),
                })
            }
        }
            }
    };
}

#[macro_export]
macro_rules! can {
    ($r:expr,$p:expr) => {
        match ::menahq_api::auth::can($r, $p).await {
        Ok(c) => c,
        Err(e) => {
            return ::vercel_runtime::http::internal_server_error(APIError {
                code: "permcheck_error".to_string(),
                message: format!("{}", e),
            })
        }
    };
    };
}