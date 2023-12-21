import prisma from "$lib/prisma";
import type {Role} from "@prisma/client";

export async function getUserRoles(cid: string): Promise<Role[]> {
    let user = await prisma.user.findUnique({
        where: {
            id: cid
        }
    });
    let roles: Role[] = [];
    for (let roleId of user.roleIds) {
        roles.push(await prisma.role.findUnique({
            where: {
                id: roleId
            }
        }));
    }
    return roles;
}

export function can(roles: Role[], perms: string[]): boolean {
    if (roles === null || roles === undefined) {
        return false;
    }
    let all_perms: string[] = [];
    for (let role of roles) {
        all_perms = all_perms.concat(role.permissions);
    }
    for (let req_perm of perms) {
        if (!all_perms.includes(req_perm)) {
            return false;
        }
    }
    return true;
}
