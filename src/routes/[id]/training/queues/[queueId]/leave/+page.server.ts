import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  let queue = await prisma.trainingQueue.findUnique({
    where: {
      id: params.queueId,
      facilityId: params.id,
    },
  });

  return {
    queue,
  };
};
