export const API_AUTH_INFO_ENDPOINT = "/api/auth/info";

export interface AuthInfo {
    vatsim_endpoint: string,
    client_id: string,
}

// Example response:
// GET /api/auth/info
// {"vatsim_endpoint":"https://auth-dev.vatsim.net","client_id":"2"}
// ... which will redirect the user to
// https://auth-dev.vatsim.net/oauth/authorize?response_type=string&client_id=2&redirect_uri=http://localhost:3000/callback&scope=full_name%20vatsim_details&state=<random state>