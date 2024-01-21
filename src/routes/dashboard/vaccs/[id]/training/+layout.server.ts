import prisma from "$lib/prisma";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ parent }) => {
  let { user } = await parent();

  let memberships = await prisma.trainingQueueMembership.findMany({
    where: {
      userId: user!.id,
    },
  });

  let memberOfQueue;

  if (memberships.length > 0) {
    let queue = await prisma.trainingQueue.findUnique({
      where: {
        id: memberships[0].queueId,
      },
    });
    memberOfQueue = queue!;
  } else {
    memberOfQueue = null;
  }

  return {
    memberOfQueue: memberOfQueue,
  };
};
