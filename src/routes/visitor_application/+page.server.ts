import type {PageServerLoad} from "./$types";
import { loadUserData } from "$lib/auth";

export const load: PageServerLoad = async ({ parent }) => {
  let { user } = await parent();

  return {
    rating: 1,
    home: 'AMAS/USA',
    fiftyHours: true,
    meetsActivityRequirements: true,
    canVisit: false
  }
}