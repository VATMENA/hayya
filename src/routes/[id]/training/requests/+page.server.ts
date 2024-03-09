import type { PageServerLoad, Actions } from "./$types";
import { loadUserData } from "$lib/auth";
import { can } from "$lib/perms/can";
import { DELETE_REQUEST, TRAIN } from "$lib/perms/permissions";
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
        gt: new Date()
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
        lt: new Date()
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
        gt: new Date()
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

export const actions: Actions = {
  deleteRequest: async (event) => {
    await loadUserData(event.cookies, event.params.id);

    if (!can(DELETE_REQUEST)) {
      redirect(307, `/${event.params.id}/training`, {type: 'error', message: 'You don\'t have permission to do that.'}, event.cookies);
    }

    await prisma.trainingRequest.delete({
      where: {
        id: (await event.request.formData()).get("id")?.toString() || ""
      }
    })
  }
}