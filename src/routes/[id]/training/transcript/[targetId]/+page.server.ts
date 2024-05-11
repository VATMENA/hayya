import type { PageServerLoad } from "./$types";
import { can } from "$lib/perms/can";
import prisma from "$lib/prisma";
import { redirect } from "sveltekit-flash-message/server";
import { TRAIN } from "$lib/perms/permissions";

export const load: PageServerLoad = async ({ parent, params, cookies }) => {
  const { user, roles } = await parent();

  const targetUser = await prisma.user.findUnique({
    where: {
      id: params.targetId,
    },
  });

  if (targetUser === null) {
    redirect(
      301,
      `/${params.id}/training`,
      { type: "error", message: "You don't have permission to do that." },
      cookies,
    );
  }

  if (!(user.id == params.targetId || can(TRAIN))) {
    redirect(
      301,
      `/${params.id}/training`,
      { type: "error", message: "You don't have permission to do that." },
      cookies,
    );
  }

  // get all the user's sessions
  const sessions = await prisma.session.findMany({
    where: {
      studentId: targetUser.id,
    },
    include: {
      instructor: true,
    },
  })!;

  if (!can(TRAIN)) {
    for (const session of sessions) {
      session.instructorComments = "[unavailable]"; // Data is just passed as json, so hidden data must be hidden at the server level
    }
  }

  return {
    sessions,
    targetUser,
  };
};
