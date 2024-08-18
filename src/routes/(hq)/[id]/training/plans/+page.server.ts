import type { PageServerLoad, Actions } from "./$types";
import { can } from "$lib/perms/can";
import { MANAGE_TRAINING_PLANS } from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { createFormSchema } from "./createSchema";
import { fail } from "@sveltejs/kit";
import { loadUserData } from "$lib/auth";
import { ulid } from "ulid";
import { updateFormSchema } from "./editSchema";

export const load: PageServerLoad = async ({ params, cookies }) => {
  await loadUserData(cookies, params.id); // This route specifically this isn't running in time and the global isn't being set. I don't know why

  if (!can(MANAGE_TRAINING_PLANS)) {
    redirect(
      307,
      `/${params.id}`,
      { type: "error", message: "You don't have permission to do that." },
      cookies,
    );
  }

  return {
    plans: await prisma.trainingPlan.findMany({
      include: {
        TrainingPlanRegistration: true,
      },
    }),
    createForm: await superValidate(zod(createFormSchema)),
    updateForm: await superValidate(zod(updateFormSchema)),
  };
};

export const actions: Actions = {
  create: async (event) => {
    const form = await superValidate(event, zod(createFormSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    await loadUserData(event.cookies, event.params.id);
    if (!can(MANAGE_TRAINING_PLANS)) {
      return fail(403, { form });
    }

    await prisma.trainingPlan.create({
      data: {
        id: ulid(),
        facilityId: event.params.id,
        name: form.data.name,
        includes: form.data.includes,
        excludes: form.data.excludes,
        estimatedTimeToCompleteTraining: form.data.estimatedTime,
        relevantPolicy: form.data.policy,
        hasAdjacentRestrictions: form.data.hasAdjacentRestriction,
        extraDetails: form.data.extraDetails,
      },
    });

    return { form };
  },
  update: async (event) => {
    const form = await superValidate(event, zod(updateFormSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    await loadUserData(event.cookies, event.params.id);
    if (!can(MANAGE_TRAINING_PLANS)) {
      return fail(403, { form });
    }

    await prisma.trainingPlan.update({
      where: {
        id: form.data.id,
      },
      data: {
        facilityId: event.params.id,
        name: form.data.name,
        includes: form.data.includes,
        excludes: form.data.excludes,
        estimatedTimeToCompleteTraining: form.data.estimatedTime,
        relevantPolicy: form.data.policy,
        hasAdjacentRestrictions: form.data.hasAdjacentRestriction,
        extraDetails: form.data.extraDetails,
      },
    });

    return { form };
  },
};
