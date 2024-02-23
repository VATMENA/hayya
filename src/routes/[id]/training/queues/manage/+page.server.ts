import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  let queues = await prisma.trainingQueue.findMany({
    where: {
      vaccId: params.id,
    },
  });

  return {
    queues,
  };
};
