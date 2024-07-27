import type { PageServerLoad, Actions } from "./$types";
import prisma from "$lib/prisma";
import { loadUserData } from "$lib/auth";
import { fail } from "@sveltejs/kit";
import { ulid } from "ulid";

export const load: PageServerLoad = async ({parent, params}) => {
  let { user } = await parent();

  // get the user's training plan registration, if they have one
  let activePlan = await prisma.trainingPlanRegistration.findFirst({
    where: {
      userId: user.id
    },
    include: {
      plan: true
    }
  });
  // get the user's training plan registration request, if they have one
  let activePlanRequest = await prisma.trainingPlanRegistrationRequest.findFirst({
    where: {
      userId: user.id
    },
    include: {
      plan: true
    }
  });

  return {
    activePlan,
    activePlanRequest,
    plans: await prisma.trainingPlan.findMany({
      where: { facilityId: params.id },
      include: { TrainingPlanRegistration: true }
    })
  }
}

export const actions: Actions = {
  enroll: async (event) => {
    let { user } = await loadUserData(event.cookies, event.params.id);
    // get the user's training plan registration, if they have one
    let activePlan = await prisma.trainingPlanRegistration.findFirst({
      where: {
        userId: user.id
      }
    });
    // get the user's training plan registration request, if they have one
    let activePlanRequest = await prisma.trainingPlanRegistrationRequest.findFirst({
      where: {
        userId: user.id
      }
    });
    if (activePlan) {
      return fail(400);
    }
    if (activePlanRequest) {
      return fail(400);
    }

    await prisma.trainingPlanRegistrationRequest.create({
      data: {
        id: ulid(),
        userId: user.id,
        planId: (await event.request.formData()).get("id")!.toString(),
        facilityId: event.params.id
      }
    });
  },
  cancelEnrollment: async (event) => {
    let { user } = await loadUserData(event.cookies, event.params.id);
    await prisma.trainingPlanRegistration.deleteMany({
      where: {
        userId: user.id
      }
    });
  }
}