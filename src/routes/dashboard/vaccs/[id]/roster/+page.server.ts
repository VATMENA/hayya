import type { PageServerLoad } from "./$types";
import {redirect} from "@sveltejs/kit";
import prisma from "$lib/prisma";
import {verifyToken} from "$lib/auth";
import type { User } from "@prisma/client";
import {can, getUserRoles} from "$lib/perms";

export const load: PageServerLoad = async ({fetch, cookies, params}) => {
    const { id } = params;

    if (!cookies.get("hq_token")) {
        redirect(301, "/");
    }
    let token = cookies.get("hq_token")!;
    let maybe_cid = verifyToken(token);
    if (maybe_cid === null) {
        redirect(301, "/");
    }
    let user = await prisma.user.findUnique({
        where: {
            id: maybe_cid!
        }
    });

    // Privacy stuff

    let vacc_roster: User[] = await prisma.user.findMany({
        where: {
            vaccId: id,
            NOT: {
                ratingShort: "SUS"
            },
            division: "MENA"
        }
    });

    let user_roles = await getUserRoles(user.id);

    let has_divisionwide = can(user_roles, ["division.roster.extended"]);
    let has_vaccwide = can(user_roles, ["vacc.roster.extended"]);

    let altered_roster = [];

    for (let roster_user of vacc_roster) {
        if (has_divisionwide || (has_vaccwide && roster_user.vacc == user.vacc)) {
            // extended. leave as-is
        } else {
            roster_user.name = roster_user.name.split(" ")[0] + " (" + roster_user.id + ")";
            altered_roster.push(roster_user);
        }
    }

    return {
        load_error: false,
        vacc_users: altered_roster
    };
};
