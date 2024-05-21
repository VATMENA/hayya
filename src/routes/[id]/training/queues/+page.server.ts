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
import { ulid } from "ulid";
import { queuePosition } from "$lib/queue";

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

    await prisma.trainingQueue.create({
      data: {
        id: ulid(),
        facilityId: event.params.id,
        name: form.data.name,
        description: form.data.description,
        joinableByDefault: form.data.openRegistration,
      },
    });

    return {
      createForm: form,
    };
  },
  join: async (event) => {
    const data = await event.request.formData();
    const { user } = await loadUserData(event.cookies, event.params.id);
    const recommended_for = user!.recommendedTrainingQueues;
    const completed = user!.completedTrainingQueues;

    const queue = await prisma.trainingQueue.findUnique({
      where: {
        id: data.get("id")!.toString(),
      },
    });

    if (!queue) {
      return fail(400, {});
    }

    let membership = await prisma.trainingQueueMembership.findFirst({
      where: {
        userId: user!.id,
      },
      include: {
        queue: true,
      },
    });
    const canJoin =
      (queue.joinableByDefault || recommended_for.includes(queue.id)) &&
      !membership &&
      !completed.includes(queue.id);

    if (!canJoin) {
      return fail(400, {});
    }

    await prisma.trainingQueueMembership.create({
      data: {
        userId: user.id,
        queueId: queue.id,
      },
    });
  },
};
