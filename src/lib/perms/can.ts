import type { Role } from "@prisma/client";

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
