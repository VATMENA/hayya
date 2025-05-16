import type { PageServerLoad } from "./$types";
import {
  PUBLIC_VATSIM_OAUTH_ENDPOINT,
  PUBLIC_VATSIM_OAUTH_CLIENT_ID,
  PUBLIC_VATSIM_OAUTH_REDIRECT_URI,
} from "$env/static/public";
import { VATSIM_OAUTH_CLIENT_SECRET } from "$env/static/private";
import prisma from "$lib/prisma";
import { makeToken } from "$lib/auth";
import { redirect } from "sveltekit-flash-message/server";
import { ulid } from "ulid";

export const load: PageServerLoad = async ({ url, cookies }) => {
  if (!url.searchParams.get("code")) {
    return {
      err: "Missing code parameter",
    };
  }

  let token_resp;
  try {
    const params = new URLSearchParams();

    params.set("grant_type", "authorization_code");
    params.set("client_id", PUBLIC_VATSIM_OAUTH_CLIENT_ID);
    params.set("client_secret", VATSIM_OAUTH_CLIENT_SECRET);

    params.set("redirect_uri", PUBLIC_VATSIM_OAUTH_REDIRECT_URI);
    params.set("code", url.searchParams.get("code")!);

    token_resp = await fetch(`${PUBLIC_VATSIM_OAUTH_ENDPOINT}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
  } catch (e) {
    console.error(e);
    return {
      err: "There was an error processing your request. Please try again later.",
    };
  }

  const token_body = await token_resp.json();

  if (!token_resp.ok) {
    console.error(`VATSIM error: ${JSON.stringify(token_body)}`);
    return {
      err: "VATSIM returned an error. Please try again later.",
    };
  }

  const vatsim_token = token_body.access_token;

  let user_details_resp;
  try {
    user_details_resp = await fetch(
      `${PUBLIC_VATSIM_OAUTH_ENDPOINT}/api/user`,
      {
        headers: {
          Authorization: `Bearer ${vatsim_token}`,
        },
      },
    );
  } catch (e) {
    console.error(e);
    return {
      err: "There was an error processing your request. Please try again later.",
    };
  }

  const user_details = (await user_details_resp.json()).data;

  await prisma.user.upsert({
    where: { id: user_details.cid },
    update: {
      name: user_details.personal.name_full,
      ratingId: user_details.vatsim.rating.id,
      ratingShort: user_details.vatsim.rating.short,
      ratingLong: user_details.vatsim.rating.long,
      region: user_details.vatsim.region.id,
      division: user_details.vatsim.division.id,
    },
    create: {
      id: user_details.cid,
      name: user_details.personal.name_full,
      ratingId: user_details.vatsim.rating.id,
      ratingShort: user_details.vatsim.rating.short,
      ratingLong: user_details.vatsim.rating.long,
      region: user_details.vatsim.region.id,
      division: user_details.vatsim.division.id,
    },
  });

  if (user_details.vatsim.subdivision && user_details.vatsim.subdivision.id && user_details.region.id == 'EMEA' && user_details.division.id == 'MENA') {
    try {
    let assignmentsToTheirFacility = await prisma.userFacilityAssignment.findMany({
      where: {
        userId: user_details.cid,
        facilityId: user_details.vatsim.subdivision.id
      }
    });
    for (let assignment of assignmentsToTheirFacility) {
      if (assignment.assignmentType != 'Primary') {
        await prisma.userFacilityAssignment.update({
          where: {
            id: assignment.id
          },
          data: {
            assignmentType: 'Primary'
          }
        });
      }
    }
    if (assignmentsToTheirFacility.length == 0) {
      await prisma.userFacilityAssignment.create({
        data: {
          id: ulid(),
          userId: user_details.cid,
          facilityId: user_details.vatsim.subdivision.id,
          assignmentType: 'Primary'
        }
      });
    }
    } catch (e) {} // VATSIM api weirdness
  }

  const token = makeToken(user_details.cid);

  cookies.set("hq_token", token, { path: "/" });

  redirect(
    307,
    "/switch_hq",
    { type: "success", message: "Logged in! Please select a HQ." },
    cookies,
  );
};
