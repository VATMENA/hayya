import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({ params, parent }) => {
  let { user } = await parent();

  let queue = await prisma.trainingQueue.findUnique({
    where: {
      id: params.queueId,
      vaccId: params.id,
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
    redirect(301, `/dashboard/vaccs/${params.id}/training`);
  } else {
    redirect(301, `/dashboard/vaccs/${params.id}/training/queues`);
  }
};