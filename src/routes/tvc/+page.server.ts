import type { PageServerLoad } from "./$types";
import {VATSIM_CORE_API_TOKEN} from "$env/static/private";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({parent}) => {
  let { user } = await parent();
  let u_d = await fetch(`https://api.vatsim.net/v2/members/${user.id}`, {
    headers: {
      "Authorization": `Bearer ${VATSIM_CORE_API_TOKEN}`
    }
  });

  let user_info = await u_d.json();

  const rating = user_info.rating;
  const home = `${user_info.region}/${user_info.division}`;

  const last_rating_change = new Date(user_info.lastratingchange);

  const initial_atc_sessions_resp = await fetch(
    `https://api.vatsim.net/v2/members/${user.id}/atc?limit=1`,
  );
  const initial_atc_sessions = await initial_atc_sessions_resp.json();

  let total_time = 0.0;
  const required = 50 * 60 * 60;

  const hours_in_last_6mo = 0.0;
  const required_hrs_in_last_6mo = 5 * 60 * 60;

  const total_atc_sessions = initial_atc_sessions.count;

  if (total_atc_sessions !== 0) {
    const atc_sessions_resp = await fetch(
      `https://api.vatsim.net/v2/members/${user.id}/atc?limit=${total_atc_sessions}`,
    );
    const atc_sessions = await atc_sessions_resp.json();

    const connections = [];

    for (const session of atc_sessions.items) {
      connections.push({
        start: new Date(session.connection_id.start),
        end: new Date(session.connection_id.end),
      });
    }

    const connections_after_promotion = [];

    const six_months_ago = new Date();
    six_months_ago.setMonth(six_months_ago.getMonth() - 6);

    for (const connection of connections) {
      if (connection.start.valueOf() >= last_rating_change.valueOf()) {
        connections_after_promotion.push(connection);
      }
      if (connection.start.valueOf() >= six_months_ago.valueOf()) {
        connections_after_promotion.push(connection);
      }
    }

    for (const connection of connections_after_promotion) {
      total_time +=
        connection.end.valueOf() / 1000 - connection.start.valueOf() / 1000;
    }
  }

  const hasNeededRating = rating >= (home === "EMEA/MENA" ? 3 : 4);
  const fiftyHours = total_time >= required;
  const meetsActivityRequirements = true;

  console.log(rating);

  const canVisit = hasNeededRating && fiftyHours && meetsActivityRequirements;

  return {
    user_updated: user_info,
    facilityAssignments: await prisma.userFacilityAssignment.findMany({
      where: {
        userId: user.id.toString()
      }
    })!,
    visitingRequirements: {
      rating,
      home,
      fiftyHours,
      meetsActivityRequirements,
      canVisit,
      total_time,
      required,
      hours_in_last_6mo,
      required_hrs_in_last_6mo,
      ratingShort: user.ratingShort,
    }
  }
};
