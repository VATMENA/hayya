import type { PageServerLoad } from "./$types";
import { can } from "$lib/perms/can";
import { MANAGE_TRAINING_PLANS } from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { createFormSchema } from "./createSchema";

export const load: PageServerLoad = async ({params, cookies}) => {
  if (!can(MANAGE_TRAINING_PLANS)) {
    redirect(307, `/${params.id}`, { type: 'error', message: 'You don\'t have permission to do that.' }, cookies);
  }

  return {
    plans: await prisma.trainingPlan.findMany({
      include: {
        TrainingPlanRegistration: true
      }
    }),
    createForm: await superValidate(zod(createFormSchema))
  }
}