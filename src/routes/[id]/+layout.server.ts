import type { LayoutServerLoad } from "./$types";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import { loadUserData } from "$lib/auth";

export const load: LayoutServerLoad = async ({ params, cookies }) => {
  let { user, roles } = await loadUserData(cookies, params.id);

  // load the facility
  let facility = await prisma.facility.findUnique({
    where: {
      id: params.id,
    },
    include: {
      roles: true,
    },
  });

  if (!facility) {
    redirect(
      301,
      "/select_hq",
      {
        type: "error",
        message: "Invalid facility ID, please select another facility.",
      },
      cookies,
    );
  }

  return {
    facility,
    user,
    roles,
  };
};
