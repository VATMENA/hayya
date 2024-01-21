import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({ params, parent }) => {
  let { user } = await parent();

  await prisma.trainingQueueMembership.deleteMany({
    where: {
      userId: user!.id,
      queueId: params!.queueId,
    },
  });

  redirect(301, `/dashboard/vaccs/${params.id}/training`);
};
