import type { LayoutServerLoad } from "./$types";
import { loadUserData } from "$lib/auth";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ cookies }) => {
  let { user } = await loadUserData(cookies, null);

  if (!user.isSiteAdmin) {
    redirect(307, "/");
  }

  return { user };
};
