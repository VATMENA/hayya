import type { LayoutServerLoad } from "./$types";
import { loadUserData, verifyToken } from "$lib/auth";

export const load: LayoutServerLoad = async ({ cookies }) => {
  let { user, roles } = await loadUserData(cookies);

  return {
    load_error: false,
    user: user,
    roles: roles,
  };
};
