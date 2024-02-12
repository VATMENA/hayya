import type { PageServerLoad } from "./$types";
import { can } from "$lib/perms/can";
import prisma from "$lib/prisma";
import { redirect } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async ({ parent, params, cookies }) => {
  const { user, roles } = await parent();

  let targetUser = await prisma.user.findUnique({
    where: {
      id: params.targetId,
    },
  });

  if (targetUser === null) {
    redirect(
      301,
      `/dashboard/vaccs/${params.id}/training`,
      { type: "error", message: "You don't have permission to do that." },
      cookies,
    );
  }

  let isMentor = can(
    roles!,
    targetUser.vaccId,
    user.vaccId,
    `vacc.${targetUser.vaccId}.training.train`,
  );

  if (!(user.id == params.targetId || isMentor)) {
    redirect(
      301,
      `/dashboard/vaccs/${params.id}/training`,
      { type: "error", message: "You don't have permission to do that." },
      cookies,
    );
  }

  // get all the user's sessions
  let sessions = await prisma.session.findMany({
    where: {
      studentId: targetUser.id,
    },
    include: {
      instructor: true,
    },
  })!;

  if (!isMentor) {
    for (let session of sessions) {
      session.instructorComments = "[unavailable]"; // Data is just passed as json, so hidden data must be hidden at the server level
    }
  }

  return {
    sessions,
    targetUser,
    isMentor,
  };
};
