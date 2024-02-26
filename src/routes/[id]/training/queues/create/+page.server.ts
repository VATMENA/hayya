import type { PageServerLoad, Actions } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { fail } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import type { TrainingQueue } from "@prisma/client";
import { ulid } from "ulid";
import {loadUserData, verifyToken} from "$lib/auth";
import { can } from "$lib/perms/can";
import { MANAGE_QUEUES } from "$lib/perms/permissions";

export const load: PageServerLoad = async ({ params }) => {
  return {
    form: await superValidate(formSchema),
  };
};

export const actions: Actions = {
  default: async (event) => {
    await loadUserData(event.cookies, event.params.id);

    if (!can(MANAGE_QUEUES)) {
      redirect(
        301,
        `/${event.params.id}`,
        { type: "error", message: "You don't have permission to do that." },
        event,
      );
    }

    const form = await superValidate(event, formSchema);
    if (!form.valid) {
      return fail(400, { form });
    }

    const queue: TrainingQueue = await prisma.trainingQueue.create({
      data: {
        id: ulid(),
        facilityId: event.params.id,
        name: form.data.name,
        description: form.data.description,
        joinableByDefault: form.data.openRegistration,
      },
    });

    redirect(
      307,
      `/${event.params.id}/training/queues/manage`,
      { type: "success", message: "Queue created successfully" },
      event,
    );
  },
};
