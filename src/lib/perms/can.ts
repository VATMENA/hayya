import type { Role } from "@prisma/client";
import { minimatch } from "minimatch";

export interface PermissionTrace {
  roles: Role[];
  targetVacc: string | null;
  userVacc: string | null;
  req_perm: string;
  all_permissions: string[];
  outcome: boolean;
  because: string;
  checked_perms: {
    original: string;
    replaced: string;
    was_replaced: boolean;
    req_perm: string;
    matched: boolean;
  }[];
}

export function _can(
  roles: Role[],
  targetVacc: string | null,
  userVacc: string | null,
  req_perm: string,
): [boolean, PermissionTrace] {
  let trace: PermissionTrace = {
    roles,
    targetVacc,
    userVacc,
    req_perm,
    all_permissions: [],
    outcome: false,
    because: "not yet evaluated",
    checked_perms: [],
  };

  if (roles === null || roles === undefined) {
    trace.outcome = false;
    trace.because = "roles is null or undefined";
    return [false, trace];
  }

  let all_perms: string[] = [];

  trace.all_permissions = all_perms;

  for (let role of roles) {
    all_perms = all_perms.concat(role.permissions);
  }

  for (let perm of all_perms) {
    let traceperm = {
      original: perm,
      replaced: "",
      req_perm,
      matched: false,
      was_replaced: false,
    };
    let real_perm = perm;
    if (targetVacc == userVacc) {
      traceperm.was_replaced = true;
      real_perm = perm.replace("vacc.own", `vacc.${targetVacc}`);
    }
    traceperm.replaced = real_perm;
    if (minimatch(req_perm, real_perm)) {
      traceperm.matched = true;
      trace.checked_perms.push(traceperm);
      return [true, trace];
    }
    traceperm.matched = false;
    trace.checked_perms.push(traceperm);
  }

  trace.because = "no permissions matched";
  return [false, trace];
}

export function can(
  roles: Role[],
  targetVacc: string | null,
  userVacc: string | null,
  req_perm: string,
): boolean {
  return _can(roles, targetVacc, userVacc, req_perm)[0];
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
