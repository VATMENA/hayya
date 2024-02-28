import type { Role, User } from "@prisma/client";
import type { Permission } from "$lib/perms/permissions";
import { getContext } from "svelte";
import { minimatch } from "minimatch";
import { userRoles, user } from "$lib/authDual";

export function can(permission: Permission): boolean {
  let roles: Role[] = [];
  let _user: User;
  try {
    roles = getContext("roles");
    _user = getContext("user");
  } catch {
    if (userRoles && user) {
      roles = userRoles;
      _user = user;
    } else {
      throw new Error(
        "can() called before setContext() on client or before loadUserData() on server",
      );
    }
  }

  if (_user.isSiteAdmin) {
    return true;
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
