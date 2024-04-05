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
    }
  });

  let memberOfQueue = membership?.queue || null;

  let position: number | null = null;
  if (memberOfQueue) {
    position = await queuePosition(user.id, memberOfQueue.id);
  }

  return {
    memberOfQueue: memberOfQueue,
    position: position,
  };
};

const queuePosition = async (userId: string, queueId: string): Promise<number> => {
    const queueMemberships = await prisma.trainingQueueMembership.findMany({
      where: {
        queueId: queueId,
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });

    const userIndex: number = queueMemberships.findIndex(member => member.userId === userId);

    return userIndex + 1;
}