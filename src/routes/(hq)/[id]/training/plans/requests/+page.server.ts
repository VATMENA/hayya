import { can } from "$lib/perms/can";
import {
  MANAGE_PLAN_ENROLLMENT_REQUESTS,
  MANAGE_TRAINING_PLANS,
} from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad, Actions } from "./$types";
import { loadUserData } from "$lib/auth";
import { fail } from "@sveltejs/kit";
import { ulid } from "ulid";

export const load: PageServerLoad = async ({ cookies, params }) => {
  if (!can(MANAGE_PLAN_ENROLLMENT_REQUESTS)) {
    redirect(
      307,
      `/${params.id}`,
      { type: "error", message: "You don't have permission to do that. (E-d011)" },
      cookies,
    );
  }

  return {
    planRequests: await prisma.trainingPlanRegistrationRequest.findMany({
      where: { facilityId: params.id },
      include: { user: true, plan: true },
    }),
  };
};

export const actions: Actions = {
  enroll: async (event) => {
    let { user } = await loadUserData(event.cookies, event.params.id);
    if (!can(MANAGE_PLAN_ENROLLMENT_REQUESTS)) {
      redirect(
        307,
        `/${event.params.id}/training`,
        { type: "error", message: "You don't have permission to do that. (E-c996)" },
        event.cookies,
      );
    }

    let id = (await event.request.formData()).get("id")!.toString();

    let joinRequest = await prisma.trainingPlanRegistrationRequest.findUnique({
      where: {
        id: id,
        facilityId: event.params.id
      },
    });
    if (!joinRequest) {
      return fail(400);
    }

    await prisma.trainingPlanRegistration.create({
      data: {
        id: ulid(),
        planId: joinRequest.planId,
        userId: joinRequest.userId,
        facilityId: event.params.id
      },
    });
    await prisma.trainingPlanRegistrationRequest.deleteMany({
      where: {
        id: id,
        facilityId: event.params.id
      },
    });
  },
  reject: async (event) => {
    let { user } = await loadUserData(event.cookies, event.params.id);
    if (!can(MANAGE_PLAN_ENROLLMENT_REQUESTS)) {
      redirect(
        307,
        `/${event.params.id}/training`,
        { type: "error", message: "You don't have permission to do that. (E-254d)" },
        event.cookies,
      );
    }

    let id = (await event.request.formData()).get("id")!.toString();

    await prisma.trainingPlanRegistrationRequest.deleteMany({
      where: {
        id: id,
        facilityId: event.params.id
      },
    });
  },
};
