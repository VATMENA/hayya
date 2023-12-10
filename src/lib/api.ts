import {PUBLIC_MENAHQ_API_BASE} from "$env/static/public";

export function endpoint(uri: string): string {
    return `${PUBLIC_MENAHQ_API_BASE}${uri}`;
}
