import prisma from "$lib/prisma";
import type { LayoutServerLoad } from "./$types";
import { queuePosition } from "$lib/queue";

export const load: LayoutServerLoad = async ({ parent }) => {
  let { user } = await parent();

  let membership = await prisma.trainingQueueMembership.findFirst({
    where: {
      userId: user!.id,
    },
    include: {
      queue: true,
    },
  });

  if (!membership) {
    return {};
  }

  const q = membership.queue;
  const position = await queuePosition(user.id, q.id);

  return {
    queue: q,
    position: position,
  };
};
