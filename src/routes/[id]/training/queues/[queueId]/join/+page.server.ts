import type { PageServerLoad } from "./$types";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({ params, parent, cookies }) => {
  let { user } = await parent();

  let queue = await prisma.trainingQueue.findUnique({
    where: {
      id: params.queueId
    },
    include: {
      members: true,
    },
  });

  let existing_membership = await prisma.trainingQueueMembership.findMany({
    where: {
      userId: user!.id,
      queueId: params!.queueId,
    },
  });
  if (
    (queue!.joinableByDefault ||
      user!.recommendedTrainingQueues.includes(queue!.id)) &&
    existing_membership.length == 0 &&
    !user!.completedTrainingQueues.includes(queue!.id)
  ) {
    await prisma.trainingQueueMembership.create({
      data: {
        queueId: params.queueId,
        userId: user!.id,
      },
    });
    redirect(
      301,
      `/${params.id}/training`,
      { type: "success", message: "Joined training queue successfully" },
      cookies,
    );
  } else {
    redirect(
      301,
      `/${params.id}/training/queues`,
      { type: "error", message: "You aren't allowed to join that queue" },
      cookies,
    );
  }
};
