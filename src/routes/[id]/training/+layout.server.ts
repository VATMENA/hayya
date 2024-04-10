import prisma from "$lib/prisma";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ parent }) => {
  const { user } = await parent();
  /*
  const memberships = await prisma.trainingQueueMembership.findMany({
  let membership = await prisma.trainingQueueMembership.findFirst({
    where: {
      userId: user!.id,
    },
    include: {
      queue: true,
    }
  });

  let memberOfQueue;

  if (memberships.length > 0) {
    const queue = await prisma.trainingQueue.findUnique({
      where: {
        id: memberships[0].queueId,
      },
    });
    memberOfQueue = queue!;
  } else {
    memberOfQueue = null;
  if (!membership) {
    return {}
  }

  const q = membership.queue;
  const position = await queuePosition(user.id, q.id);

  return {
    queue: q,
    position: position,
  };

 */
  return {};
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
