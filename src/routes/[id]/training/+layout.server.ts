import prisma from "$lib/prisma";
import type { LayoutServerLoad } from "./$types";

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

const queuePosition = async (
  userId: string,
  queueId: string,
): Promise<number> => {
  const queueMemberships = await prisma.trainingQueueMembership.findMany({
    where: {
      queueId: queueId,
    },
    orderBy: {
      joinedAt: "asc",
    },
  });

  const userIndex: number = queueMemberships.findIndex(
    (member) => member.userId === userId,
  );

  return userIndex + 1;
};
