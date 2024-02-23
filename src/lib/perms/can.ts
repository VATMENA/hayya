import type { Role } from "@prisma/client";
import type { Permission } from "$lib/perms/permissions";
import { getContext } from "svelte";
import { minimatch } from "minimatch";

export function can(permission: Permission): boolean {
  let roles: Role[] = getContext("roles");

  for (let role of roles) {
    for (let rPermission of role.permissions) {
      if (minimatch(permission.id, rPermission)) {
        return true;
      }
    }
  }

  return false;
}
