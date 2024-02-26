import prisma from "$lib/prisma";
import type { PageServerLoad, Actions } from "./$types";
import { loadUserData } from "$lib/auth";
import { can } from "$lib/perms/can";
import { MANAGE_QUEUES } from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async ({ params, cookies }) => {
  let queue = await prisma.trainingQueue.findUnique({
    where: {
      id: params.queueId
    },
  });

  if (!queue) {
    redirect(307, `/${params.id}/training/queues/manage`, { type: 'error', message: 'Queue does not exist' }, cookies);
  }

  return {
    queue,
  };
};

export const actions: Actions = {
  default: async ({cookies, params}) => {
    await loadUserData(cookies, params.id);

    if (!can(MANAGE_QUEUES)) {
      redirect(
        301,
        `/${params.id}`,
        { type: "error", message: "You don't have permission to do that." },
        cookies,
      );
    }

    await prisma.trainingQueue.delete({
      where: {
        id: params.queueId
      },
    });

    redirect(
      301,
      `/${params.id}/training/queues/manage`,
      { type: "success", message: "Queue removed successfully!" },
      cookies,
    );
  }
}