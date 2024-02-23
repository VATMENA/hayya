import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";
import { redirect } from "sveltekit-flash-message/server";
import { verifyToken } from "$lib/auth";
import { can } from "$lib/perms/can";
import { MANAGE_QUEUES } from "$lib/perms/permissions";

export const load: PageServerLoad = async ({ params, cookies }) => {
  if (!cookies.get("hq_token")) {
    redirect(
      301,
      "/",
      { type: "error", message: "You need to be logged in for that" },
      cookies,
    );
  }
  let token = cookies.get("hq_token")!;
  let maybe_cid = verifyToken(token);
  if (maybe_cid === null) {
    redirect(
      301,
      "/",
      { type: "error", message: "You need to be logged in for that" },
      cookies,
    );
  }
  let user = await prisma.user.findUnique({
    where: {
      id: maybe_cid!,
    },
  })!;
  let roles = await getUserRoles(user!.id);

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
      id: params.queueId,
      vaccId: params.id,
    },
  });

  redirect(
    301,
    `/${params.id}/training/queues/manage`,
    { type: "success", message: "Queue removed successfully!" },
    cookies,
  );
};
