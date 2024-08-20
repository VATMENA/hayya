import type { PageServerLoad, Actions } from "./$types";
import prisma from "$lib/prisma";
import { loadUserData } from "$lib/auth";
import { fail } from "@sveltejs/kit";
import { ulid } from "ulid";
import { superValidate } from "sveltekit-superforms/server";
import { requestSchema } from "./requestSchema";
import { zod } from "sveltekit-superforms/adapters";
import { reversed } from "$lib/autil";

export const load: PageServerLoad = async ({ parent, params }) => {
  let { user } = await parent();

  // get the user's training plan registration, if they have one
  let activePlan = await prisma.trainingPlanRegistration.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      plan: true,
      requests: true,
    },
  });
  // get the user's training plan registration request, if they have one
  let activePlanRequest =
    await prisma.trainingPlanRegistrationRequest.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        plan: true,
      },
    });

  return {
    activePlan,
    activePlanRequest,
    plans: await prisma.trainingPlan.findMany({
      where: { facilityId: params.id },
      include: { TrainingPlanRegistration: true },
    }),
    sessions: reversed(
      await prisma.trainingSession.findMany({
        where: { studentId: user.id },
        include: {
          plan: true,
          mentor: true,
        },
      }),
    ),
    mentorSessions: reversed(
      await prisma.trainingSession.findMany({
        where: { mentorId: user.id },
        include: {
          plan: true,
          student: true,
        },
      }),
    ),
    requestForm: await superValidate(zod(requestSchema)),
  };
};

export const actions: Actions = {
  enroll: async (event) => {
    let { user } = await loadUserData(event.cookies, event.params.id);
    // get the user's training plan registration, if they have one
    let activePlan = await prisma.trainingPlanRegistration.findFirst({
      where: {
        userId: user.id,
      },
    });
    // get the user's training plan registration request, if they have one
    let activePlanRequest =
      await prisma.trainingPlanRegistrationRequest.findFirst({
        where: {
          userId: user.id,
        },
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
        facilityId: event.params.id,
      },
    });
  },
  cancelEnrollment: async (event) => {
    let { user } = await loadUserData(event.cookies, event.params.id);
    await prisma.trainingPlanRegistration.deleteMany({
      where: {
        userId: user.id,
      },
    });
  },
  request: async (event) => {
    let { user } = await loadUserData(event.cookies, event.params.id);

    let form = await superValidate(event, zod(requestSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    let planRegs = await prisma.trainingPlanRegistration.findMany({
      where: {
        userId: user.id,
      },
    });

    if (planRegs.length === 0) {
      return fail(400, { form });
    }

    let reg = planRegs[0];

    await prisma.trainingRequest.create({
      data: {
        id: ulid(),
        registrationId: reg.id,
        availability: JSON.stringify(form.data.availability),
        notes: form.data.notes,
        facilityId: event.params.id,
      },
    });

    return { form };
  },
  cancelRequest: async (event) => {
    let { user } = await loadUserData(event.cookies, event.params.id);
    await prisma.trainingRequest.deleteMany({
      where: {
        id: (await event.request.formData()).get("id")!.toString(),
      },
    });
  },
};
