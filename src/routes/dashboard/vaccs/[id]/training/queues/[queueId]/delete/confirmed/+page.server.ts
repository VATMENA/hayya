import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";
import { redirect } from "sveltekit-flash-message/server";
import { verifyToken } from "$lib/auth";
import { getUserRoles } from "$lib/perms/getUserRoles";
import { can } from "$lib/perms/can";

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

  if (
    !can(
      roles!,
      params.id,
      user!.vaccId,
      `vacc.${params.id}.training.queues.manage`,
    )
  ) {
    redirect(
      301,
      `/dashboard/vaccs/${params.id}`,
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
    `/dashboard/vaccs/${params.id}/training/queues/manage`,
    { type: "success", message: "Queue removed successfully!" },
    cookies,
  );
};
