import type { Role } from "@prisma/client";
import { minimatch } from "minimatch";

export function can(
  roles: Role[],
  targetVacc: string | null,
  userVacc: string | null,
  req_perm: string,
): boolean {
  if (roles === null || roles === undefined) {
    return false;
  }
  let all_perms: string[] = [];
  for (let role of roles) {
    all_perms = all_perms.concat(role.permissions);
  }
  for (let perm of all_perms) {
    let real_perm = perm;
    if (targetVacc == userVacc) {
      real_perm = perm.replace("vacc.own", `vacc.${targetVacc}`);
    }
    if (minimatch(req_perm, real_perm)) {
      return true;
    }
  }

  return false;
}

export function canAny(
  roles: Role[],
  targetVacc: string,
  userVacc: string,
  perms: string[],
): boolean {
  for (let needed_perm of perms) {
    if (can(roles, targetVacc, userVacc, needed_perm)) {
      return true;
    }
  }
  return false;
}

export function canAll(
  roles: Role[],
  targetVacc: string,
  userVacc: string,
  perms: string[],
): boolean {
  for (let needed_perm of perms) {
    if (!can(roles, targetVacc, userVacc, needed_perm)) {
      return false;
    }
  }
  return true;
}
