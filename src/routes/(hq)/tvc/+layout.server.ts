import type { LayoutServerLoad } from "./$types";
import { loadUserData } from "$lib/auth";

export const load: LayoutServerLoad = async ({ cookies }) => {
  const { user } = await loadUserData(cookies, null);

  return { user };
};
