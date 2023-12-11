import type { PageServerLoad } from "./$types";
import {endpoint} from "$lib/api";
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async ({fetch, cookies, params}) => {
    const { id } = params;

    if (!cookies.get("hqt")) {
        throw redirect(301, "/");
    }

    let res = await fetch(endpoint(`/api/roster/vacc?id=${id}`), {
        headers: {
            "X-HQ-Token": cookies.get("hqt")!
        }
    });

    if (!res.ok) {
        return {
            load_error: true,
            vacc_users: []
        }
    }

    let json = await res.json();

    return {
        load_error: false,
        vacc_users: json.users
    };
};
