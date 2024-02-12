import type { PageServerLoad } from "./$types";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({ params, parent, cookies }) => {
  let { user } = await parent();

  await prisma.trainingQueueMembership.deleteMany({
    where: {
      userId: user!.id,
      queueId: params!.queueId,
    },
  });

  redirect(
    301,
    `/dashboard/vaccs/${params.id}/training`,
    { type: "success", message: "Left queue successfully!" },
    cookies,
  );
};
