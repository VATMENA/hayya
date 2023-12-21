import type { PageServerLoad } from "./$types";
import {redirect} from "@sveltejs/kit";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({fetch, cookies}) => {
    if (!cookies.get("hq_token")) {
        redirect(301, "/");
    }

    let vaccs = await prisma.vacc.findMany();

    return {
        load_error: false,
        vaccs: vaccs
    };
};
