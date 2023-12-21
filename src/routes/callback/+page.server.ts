import type { PageServerLoad } from "./$types";
import {error, redirect} from "@sveltejs/kit";
import {PUBLIC_VATSIM_OAUTH_ENDPOINT, PUBLIC_VATSIM_OAUTH_CLIENT_ID, PUBLIC_VATSIM_OAUTH_REDIRECT_URI} from "$env/static/public";
import {VATSIM_OAUTH_CLIENT_SECRET} from "$env/static/private";
import prisma from "$lib/prisma";
import {makeToken} from "$lib/auth";

export const load: PageServerLoad = async ({url, cookies}) => {
    if (!url.searchParams.get("code")) {
        return {
            err: "Missing code parameter"
        }
    }

    let token_resp;
    try {
        let params = new URLSearchParams();

        params.set("grant_type", "authorization_code");
        params.set("client_id", PUBLIC_VATSIM_OAUTH_CLIENT_ID);
        params.set("client_secret", VATSIM_OAUTH_CLIENT_SECRET);

        params.set("redirect_uri", PUBLIC_VATSIM_OAUTH_REDIRECT_URI);
        params.set("code", url.searchParams.get("code")!);

        token_resp = await fetch(`${PUBLIC_VATSIM_OAUTH_ENDPOINT}/oauth/token`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
        });
    } catch (e) {
        console.error(e);
        return {
            err: "There was an error processing your request. Please try again later."
        }
    }

    let token_body = await token_resp.json();

    if (!token_resp.ok) {
        console.error(`VATSIM error: ${JSON.stringify(token_body)}`);
        return {
            err: "VATSIM returned an error. Please try again later."
        }
    }

    let vatsim_token = token_body.access_token;

    let user_details_resp;
    try {
        user_details_resp = await fetch(`${PUBLIC_VATSIM_OAUTH_ENDPOINT}/api/user`, {
            headers: {
                "Authorization": `Bearer ${vatsim_token}`
            }
        });
    } catch (e) {
        console.error(e);
        return {
            err: "There was an error processing your request. Please try again later."
        }
    }

    let user_details = (await user_details_resp.json()).data;

    let should_be_controller = user_details.vatsim.division.id == "MENA";

    await prisma.user.upsert({
        where: { id: user_details.cid },
        update: {
            name: user_details.personal.name_full,
            ratingId: user_details.vatsim.rating.id,
            ratingShort: user_details.vatsim.rating.short,
            ratingLong: user_details.vatsim.rating.long,
            region: user_details.vatsim.region.id,
            division: user_details.vatsim.division.id
        },
        create: {
            id: user_details.cid,
            name: user_details.personal.name_full,
            ratingId: user_details.vatsim.rating.id,
            ratingShort: user_details.vatsim.rating.short,
            ratingLong: user_details.vatsim.rating.long,
            region: user_details.vatsim.region.id,
            division: user_details.vatsim.division.id,
            vaccId: null,
            roleIds: should_be_controller ? ["01HGRHM5BTJDXG8VT7MCZ9B2F6"] : ["01HGRHMZ0JKRAGWG2DG0QH5Q16"]
        }
    });

    let token = makeToken(user_details.cid);
    cookies.set("hq_token", token, {path: "/"});
    redirect(301, "/dashboard");
}
