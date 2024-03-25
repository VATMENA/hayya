import type {PageServerLoad} from "./$types";
import { loadUserData } from "$lib/auth";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
  let { user } = await loadUserData(cookies, null);

  let rating = user.ratingId;
  let home = `${user.region}/${user.division}`;

  // https://api.vatsim.net/v2/members/:id/atc
  // https://api.vatsim.net/v2/members/1710004/ <- lastratingchange

  let user_info_resp = await fetch(`https://api.vatsim.net/v2/members/${user.id}`);
  let user_info = await user_info_resp.json();

  let last_rating_change = new Date(user_info.lastratingchange);

  let initial_atc_sessions_resp = await fetch(`https://api.vatsim.net/v2/members/${user.id}/atc?limit=1`);
  let initial_atc_sessions = await initial_atc_sessions_resp.json();

  let total_time = 0.0;
  let required = 50 * 60 * 60;

  let total_atc_sessions = initial_atc_sessions.count;

  if (total_atc_sessions !== 0) {
    let atc_sessions_resp = await fetch(`https://api.vatsim.net/v2/members/${user.id}/atc?limit=${total_atc_sessions}`);
    let atc_sessions = await atc_sessions_resp.json();

    let connections = [];

    for (let session of atc_sessions.items) {
      connections.push({
        start: new Date(session.connection_id.start),
        end: new Date(session.connection_id.end)
      });
    }

    let connections_after_promotion = [];

    for (let connection of connections) {
      if (connection.start.valueOf() >= last_rating_change.valueOf()) {
        connections_after_promotion.push(connection);
      }
    }


    for (let connection of connections_after_promotion) {
      total_time += connection.end.valueOf() / 1000 - connection.start.valueOf() / 1000;
    }
  }

  let hasNeededRating = rating >= (home === 'EMEA/MENA' ? 3 : 4);
  let fiftyHours = total_time >= required;
  let meetsActivityRequirements = true;

  let canVisit = hasNeededRating && fiftyHours && meetsActivityRequirements;

  return {
    rating,
    ratingShort: user.ratingShort,
    home,
    fiftyHours,
    meetsActivityRequirements,
    canVisit,
    total_time,
    required
  }
}