import type { LayoutServerLoad } from "./$types";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import { loadUserData } from "$lib/auth";

export const load: LayoutServerLoad = async ({ params, cookies, url }) => {
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

  // check for a user assignment
  const assignments = await prisma.userFacilityAssignment.findMany({
    where: {
      userId: user.id,
      facilityId: facility.id
    }
  });

  // only allow non-members to access the roster
  if (assignments.length === 0 && !url.pathname.includes("roster")) {
    redirect(
      301,
      "/switch_hq",
      show_popup
        ? {
          type: "error",
          message: "You don't have permission to access that facility.",
        }
        : undefined,
      cookies,
    );
  }

  return {
    facility,
    user,
    roles,
    assignments
  };
};
