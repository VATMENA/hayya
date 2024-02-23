import type { Role } from "@prisma/client";
import type { Permission } from "$lib/perms/permissions";
import { getContext } from "svelte";
import { minimatch } from "minimatch";
import {userRoles} from "$lib/authDual";

export function can(permission: Permission): boolean {
  let roles: Role[] = [];
  try {
    roles = getContext("roles");
  } catch {
    if (userRoles) {
      roles = userRoles;
    } else {
      throw new Error("can() called before setContext() on client or before loadUserData() on server");
    }
  }

  for (let role of roles) {
    for (let rPermission of role.permissions) {
      if (minimatch(permission.id, rPermission)) {
        return true;
      }
    }
  }

  return false;
}
