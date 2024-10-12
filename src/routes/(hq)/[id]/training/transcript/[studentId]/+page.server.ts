import type { PageServerLoad } from "./$types";
import { can } from "$lib/perms/can";
import { TRAIN } from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import { reversed } from "$lib/autil";

export const load: PageServerLoad = async ({ params, cookies }) => {
  if (!can(TRAIN)) {
    redirect(
      307,
      `/${params.id}`,
      { type: "error", message: "You don't have permission to do that." },
      cookies,
    );
  }

  let student = await prisma.user.findUnique({
    where: { id: params.studentId },
  });

  if (student === null) {
    return redirect(
      307,
      `/${params.id}/training`,
      { type: "error", message: "Couldn't find a student by that CID." },
      cookies,
    );
  }

  return {
    student,
    sessions: reversed(
      await prisma.trainingSession.findMany({
        where: { studentId: params.studentId, facilityId: params.id },
        include: {
          plan: true,
          mentor: true,
        },
      }),
    ),
  };
};
