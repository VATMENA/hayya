import type { LayoutServerLoad } from "./$types";
import {verifyToken} from "$lib/auth";
import prisma from "$lib/prisma";

export const load: LayoutServerLoad = async ({fetch, cookies}) => {
    if (!cookies.get("hq_token")) {
        return {
            loggedin: false,
            user: null,
            roles: null
        }
    }

    let token = cookies.get("hq_token")!;
    let maybe_cid = verifyToken(token);

    if (maybe_cid === null) {
        return {
            loggedin: false,
            user: null,
            roles: null
        }
    }

    let cid = maybe_cid!;

    let user = await prisma.user.findUnique({
        where: { id: cid },
        include: {
            vacc: true
        }
    });

    let roles = [];

    for (let roleId of user.roleIds) {
        roles.push(await prisma.role.findUnique({
            where: { id: roleId }
        }))
    }

    return {
        loggedin: true,
        user: user,
        roles: roles
    };
};
