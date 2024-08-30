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

  if (!roles || !_user) {
    throw new Error(
      "can() called before setContext() on client or before loadUserData() on server",
    );
  }

  console.log(`[PERMISSION DEBUG]: checking ${JSON.stringify(permission)} for ${_user.id}`);
  console.log(_user);
  
  if (_user.isSiteAdmin) {
    console.log(`[PERMISSION DEBUG]: approved, isSiteAdmin = true`);
    return true;
  }

  for (const role of roles) {
    console.log(role);
    for (const rPermission of role.permissions) {
      if (minimatch(permission.id, rPermission)) {
        console.log(`[PERMISSION DEBUG]: approved, ${rPermission} matches ${permission.id} for ${role.id}`);
        return true;
      }
    }
  }

  console.log(`[PERMISSION DEBUG]: denied, no matcher and not admin`);
  return false;
}
