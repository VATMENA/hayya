export interface User {
    id: string,
    name_first: string,
    name_last: string,
    name_full: string,
    controller_rating_id: number,
    controller_rating_short: string,
    controller_rating_long: string,
    pilot_rating_id: number,
    pilot_rating_short: string,
    pilot_rating_long: string,
    region_id: string,
    region_name: string,
    division_id: string,
    division_name: string,
    subdivision_id: string | null,
    subdivision_name: string | null,
    role: string,
    vacc: string | null
}

export interface Role {
    id: string,
    name: string,
    permissions: []
}

export interface vACC {
    id: string,
    name: string,
    website: string,
    contact_email: string
}

export interface AuditLogEntry {
    id: string,
    timestamp: number,
    actor: string,
    item: string,
    before: any | null,
    after: any | null,
    message: string
}
