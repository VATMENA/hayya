import type { PageServerLoad } from "./$types";
import { loadUserData } from "$lib/auth";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
  const { user } = await loadUserData(cookies, null);

  const rating = user.ratingId;
  const home = `${user.region}/${user.division}`;

  // https://api.vatsim.net/v2/members/:id/atc
  // https://api.vatsim.net/v2/members/1710004/ <- lastratingchange

  const user_info_resp = await fetch(
    `https://api.vatsim.net/v2/members/${user.id}`,
  );
  const user_info = await user_info_resp.json();

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

  const canVisit = hasNeededRating && fiftyHours && meetsActivityRequirements;

  return {
    rating,
    ratingShort: user.ratingShort,
    home,
    fiftyHours,
    meetsActivityRequirements,
    canVisit,
    total_time,
    required,
    hours_in_last_6mo,
    required_hrs_in_last_6mo,
  };
};
