import type { PageServerLoad } from "./$types";
import {endpoint} from "$lib/api";
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async ({fetch, cookies}) => {
    if (!cookies.get("hqt")) {
        throw redirect(301, "/");
    }

    let vacc_res = await fetch(endpoint("/api/vacc/list"), {
        headers: {
            "X-HQ-Token": cookies.get("hqt")!
        }
    });

    if (!vacc_res.ok) {
        return {
            load_error: true,
            vaccs: []
        }
    }

    let vaccs_json = await vacc_res.json();

    return {
        load_error: false,
        vaccs: vaccs_json.vaccs
    };
};
