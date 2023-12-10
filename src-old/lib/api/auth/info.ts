import {fetchTimeout} from "$lib/api/fetch_timeout";

export const API_AUTH_INFO_ENDPOINT = "/api/auth/info";

export interface AuthInfo {
    vatsim_endpoint: string,
    client_id: string,
}

export async function getAuthInfo(): Promise<AuthInfo> {
    let resp = await fetchTimeout(API_AUTH_INFO_ENDPOINT);
    if (!resp.ok) {
        throw new Error("server returned error response");
    }
    return await resp.json();
}