import {fetchTimeout} from "$lib/api/fetch_timeout";

export const API_ROSTER_HOME_ENDPOINT = "/api/roster/home";

export interface HomeRoster {
    users: RosterUser[]
}
export interface RosterUser {
    cid: string,
    name_first: string,
    name_last: string,
    role: string,
    rating: string,
    vacc: string | null
}

export async function getHomeRoster(): Promise<HomeRoster> {
    let resp = await fetchTimeout(API_ROSTER_HOME_ENDPOINT, {
        headers: {
            "X-HQ-Token": window.localStorage.getItem("menahq-token")
        }
    });
    if (!resp.ok) {
        throw new Error("server returned error response");
    }
    return await resp.json();
}
