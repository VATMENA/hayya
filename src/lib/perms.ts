import prisma from "$lib/prisma";
import type { Role } from "@prisma/client";

export async function getUserRoles(cid: string): Promise<Role[] | null> {
  let user = await prisma.user.findUnique({
    where: {
      id: cid,
    },
  });
  if (!user) {
    return null;
  }
  let roles: Role[] = [];
  for (let roleId of user.roleIds) {
    const role = await prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });
    if (!role) return null;
    roles.push(role);
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
    let perm_id;
    let or = req_perm.startsWith("|");
    let and = req_perm.startsWith("&");
    perm_id = req_perm.substring(1);

    if (or && all_perms.includes(req_perm)) {
      return true;
    }

    if (and && !all_perms.includes(req_perm)) {
      return false;
    }
  }
  return true;
}
