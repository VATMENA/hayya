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
