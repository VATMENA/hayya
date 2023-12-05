import {fetchTimeout} from "$lib/api/fetch_timeout";
import type {Role, User} from "$lib/api/models";

export const API_AUTH_TOKEN_ENDPOINT = "/api/auth/token";

export interface TokenResponse {
    token: string,
    user: User,
    role: Role
}

export async function authWithVatsimCode(code: string): Promise<TokenResponse> {
    let resp = await fetchTimeout(API_AUTH_TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({code: code, redirect_uri: window.location.origin + "/callback"})
    });
    if (!resp.ok) {
        throw new Error("server returned error response, see console for details");
    }
    return await resp.json();
}
