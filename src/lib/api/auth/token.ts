import {fetchTimeout} from "$lib/api/fetch_timeout";

export const API_AUTH_TOKEN_ENDPOINT = "/api/auth/token";

export interface TokenResponse {
    token: string
}

export async function authWithVatsimCode(code: string): TokenResponse {
    let resp = await fetchTimeout(API_AUTH_TOKEN_ENDPOINT);
    if (!resp.ok) {
        throw new Error("server returned error response");
    }
    return await resp.json();
}