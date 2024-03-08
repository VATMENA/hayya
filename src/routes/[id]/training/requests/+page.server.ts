import type { PageServerLoad } from "./$types";
import { loadUserData } from "$lib/auth";
import { can } from "$lib/perms/can";
import { TRAIN } from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({cookies, params}) => {
  await loadUserData(cookies, params.id);

  if (!can(TRAIN)) {
    redirect(307, `/${params.id}/training`, {type: "error", message: "You don't have permission to do that."}, cookies);
  }

  let unassigned = await prisma.trainingRequest.findMany({
    where: {
      facilityId: params.id,
      endDate: {
        lt: new Date()
      },
      instructorId: null
    },
    include: {
      student: true,
      instructor: true
    }
  });
  let expired = await prisma.trainingRequest.findMany({
    where: {
      facilityId: params.id,
      endDate: {
        gt: new Date()
      }
    },
    include: {
      student: true,
      instructor: true
    }
  });
  let assigned = await prisma.trainingRequest.findMany({
    where: {
      facilityId: params.id,
      endDate: {
        lt: new Date()
      },
      NOT: {
        instructorId: null
      }
    },
    include: {
      student: true,
      instructor: true
    }
  });

  return {
    unassigned,
    assigned,
    expired
  }
}