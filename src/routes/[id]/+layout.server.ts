import type { LayoutServerLoad } from "./$types";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import { loadUserData } from "$lib/auth";

export const load: LayoutServerLoad = async ({ params, cookies }) => {
  const { user, roles } = await loadUserData(cookies, params.id);

  const show_popup = [
    "admin",
    "api",
    "callback",
    "logout",
    "switch_hq",
    "visitor_application",
  ].includes(params.id);

  // load the facility
  const facility = await prisma.facility.findUnique({
    where: {
      id: params.id,
    },
    include: {
      roles: true,
      trainingQueues: true,
    },
  });

  if (!facility) {
    redirect(
      301,
      "/switch_hq",
      show_popup
        ? {
            type: "error",
            message: "Invalid facility ID, please select another facility.",
          }
        : undefined,
      cookies,
    );
  }

  return {
    facility,
    user,
    roles,
  };
};
