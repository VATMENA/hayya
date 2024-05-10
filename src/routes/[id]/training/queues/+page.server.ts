import prisma from "$lib/prisma";
import type { PageServerLoad, Actions } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { createSchema } from "./create-schema";
import { fail } from "@sveltejs/kit";
import { loadUserData } from "$lib/auth";
import { can } from "$lib/perms/can";
import { MANAGE_QUEUES } from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async ({ params, parent }) => {
  const { user, queue: memberOfQueue } = await parent();

  const all_queues = await prisma.trainingQueue.findMany({
    where: {
      facilityId: params.id,
    },
  });

  const recommended_for = user!.recommendedTrainingQueues;
  const completed = user!.completedTrainingQueues;

  const canJoin = [];

  for (const queue of all_queues) {
    if (
      (queue.joinableByDefault || recommended_for.includes(queue.id)) &&
      !memberOfQueue &&
      !completed.includes(queue.id)
    ) {
      canJoin.push(queue.id);
    }
  }

  return {
    queues: all_queues,
    canJoin,
    createForm: await superValidate(zod(createSchema)),
  };
};

export const actions: Actions = {
  create: async (event) => {
    const form = await superValidate(event, zod(createSchema));
    if (!form.valid) {
      return fail(400, {
        createForm: form,
      });
    }

    await loadUserData(event.cookies, event.params.id);

    if (!can(MANAGE_QUEUES)) {
      redirect(
        307,
        "/training",
        { type: "error", message: "You don't have permission to do that." },
        event.cookies,
      );
    }

    return {
      createForm: form,
    };
  },
};
