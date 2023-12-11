import type { PageServerLoad } from "./$types";
import {endpoint} from "$lib/api";
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async ({fetch, cookies}) => {
    if (!cookies.get("hqt")) {
        throw redirect(301, "/");
    }

    let res = await fetch(endpoint("/api/roster/home"), {
        headers: {
            "X-HQ-Token": cookies.get("hqt")!
        }
    });

    if (!res.ok) {
        return {
            load_error: true,
            home_users: []
        }
    }

    let json = await res.json();

    return {
        load_error: false,
        home_users: json.users
    };
};
