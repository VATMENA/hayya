import prisma from "$lib/prisma";

export const queuePosition = async (
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
