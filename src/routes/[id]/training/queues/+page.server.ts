import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, parent }) => {
  let { user, queue: memberOfQueue } = await parent();

  let all_queues = await prisma.trainingQueue.findMany({
    where: {
      facilityId: params.id,
    },
  });

  let recommended_for = user!.recommendedTrainingQueues;
  let completed = user!.completedTrainingQueues;

  let canJoin = [];

  for (let queue of all_queues) {
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
  };
};
