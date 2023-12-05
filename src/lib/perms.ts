import type {Role, User} from "$lib/api/models";
import {browser} from "$app/environment";
import {onMount} from "svelte";

export function loggedIn(): boolean {
    if (browser) {
        return window.localStorage.getItem("menahq-token") !== null && window.localStorage.getItem("menahq-user") !== null && window.localStorage.getItem("menahq-role") !== null;
    } else {
        return false;
    }
}

export function user(): User | null {
    if (browser) {
        if (window.localStorage.getItem("menahq-user") !== null) {
            return JSON.parse(window.localStorage.getItem("menahq-user")!);
        } else {
            return null;
        }
    } else {
        return null;
    }
}
export function role(): Role | null {
    if (browser) {
        if (window.localStorage.getItem("menahq-role") !== null) {
            return JSON.parse(window.localStorage.getItem("menahq-role")!);
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export function can(permission: string): boolean {
    if (!loggedIn()) {
        return false;
    }
    if (permission === "loggedin") {
        return true;
    }
    if (role() !== null) {
        // @ts-ignore
        return role()?.permissions.includes(permission)!;
    }
    return false;
}

export function needsPermissions(perms: string[]) {
    if (browser) {
        for (let perm of perms) {
            if (!can(perm)) {
                window.location.href = "/";
            }
        }
    }
}
