import type { PageServerLoad } from "./$types";
import { can } from "$lib/perms/can";
import { loadUserData } from "$lib/auth";
import { EDIT_DETAILS } from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async ({ params, cookies }) => {
  await loadUserData(cookies, params.id);

  if (!can(EDIT_DETAILS)) {
    redirect(
      307,
      `/${params.id}`,
      { type: "error", message: "You don't have permission for that." },
      cookies,
    );
  }
};
