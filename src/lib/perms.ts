export interface Role {
    permissions: string[]
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
        if (!all_perms.includes(req_perm)) {
            return false;
        }
    }
    return true;
}
