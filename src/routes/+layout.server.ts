import type { LayoutServerLoad } from "./$types";
import {endpoint} from "$lib/api";

export const load: LayoutServerLoad = async ({fetch, cookies}) => {
    if (!cookies.get("hqt")) {
        return {
            loggedin: false,
            user: null,
            roles: null
        }
    }

    let res = await fetch(endpoint("/api/auth/whoami"), {
        headers: {
            "X-HQ-Token": cookies.get("hqt")!
        }
    });

    if (!res.ok) {
        return {
            loggedin: false,
            user: null,
            roles: null
        }
    }

    let json = await res.json();

    return {
        loggedin: true,
        user: json.user,
        roles: json.roles
    };
};
