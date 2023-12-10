import type { PageLoad } from './$types';
import {endpoint} from "$lib/api";

export const load: PageLoad = async ({ fetch }) => {
    let res = await fetch(endpoint("/api/auth/info"));
    let json = await res.json();

    return { json };
};
