import type { PageServerLoad, Actions } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { fail, redirect } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { TrainingQueue } from "@prisma/client";
import { ulid } from "ulid";

export const load: PageServerLoad = async ({ params }) => {
  return {
    form: await superValidate(formSchema),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, formSchema);
    if (!form.valid) {
      return fail(400, { form });
    }

    const queue: TrainingQueue = await prisma.trainingQueue.create({
      data: {
        id: ulid(),
        vaccId: event.params.id,
        name: form.data.name,
        description: form.data.description,
        joinableByDefault: form.data.openRegistration,
      },
    });

    redirect(307, `/dashboard/vaccs/${event.params.id}/training/queues/manage`);
  },
};
