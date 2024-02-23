import type {Role} from "@prisma/client";

export let userRoles: Role[] | null = null;

export function setUserRoles(roles: Role[]) {
    userRoles = roles;
}
