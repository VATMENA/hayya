import type {AuthInfo} from "$lib/api/auth/info";

export function redirectUrl(info: AuthInfo): string {
    // Example response:
// GET /api/auth/info
// {"vatsim_endpoint":"https://auth-dev.vatsim.net","client_id":"2"}
// ... which will redirect the user to
// https://auth-dev.vatsim.net/oauth/authorize?response_type=string&client_id=2&redirect_uri=http://localhost:3000/callback&scope=full_name%20vatsim_details&state=<random state>
    let location = window.location.origin + "/callback";
    return `${info.vatsim_endpoint}/oauth/authorize?response_type=code&client_id=${info.client_id}&redirect_uri=${location}&scope=full_name+vatsim_details`;
}