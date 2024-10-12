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
  if (!can(MANAGE_TRAINING_PLANS)) {
    redirect(
      307,
      `/${params.id}`,
      { type: "error", message: "You don't have permission to do that." },
      cookies,
    );
  }

  return {
    planRegistrations: await prisma.trainingPlanRegistration.findMany({
      where: { facilityId: params.id, planId: params.planId },
      include: { user: true, plan: true },
    }),
    plan: await prisma.trainingPlan.findUnique({
      where: {
        id: params.planId
      }
    })
  };
};

export const actions: Actions = {
  remove: async (event) => {
    let { user } = await loadUserData(event.cookies, event.params.id);
    if (!can(MANAGE_TRAINING_PLANS)) {
      redirect(
        307,
        `/${event.params.id}/training`,
        { type: "error", message: "You don't have permission to do that." },
        event.cookies,
      );
    }

    let id = (await event.request.formData()).get("id")!.toString();

    await prisma.trainingPlanRegistration.deleteMany({
      where: {
        id: id,
        facilityId: event.params.id
      },
    });
  },
};
