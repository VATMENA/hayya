import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { verifyToken } from "$lib/auth";
import { getUserRoles } from "$lib/perms/getUserRoles";
import { can } from "$lib/perms/can";

export const load: PageServerLoad = async ({ cookies }) => {
  if (!cookies.get("hq_token")) {
    redirect(301, "/");
  }
  let token = cookies.get("hq_token")!;
  let maybe_cid = verifyToken(token);
  if (maybe_cid === null) {
    redirect(301, "/");
  }
  let user = await prisma.user.findUnique({
    where: {
      id: maybe_cid,
    },
  })!;
  if (!user) {
    redirect(307, "/");
  }
  let user_roles = await getUserRoles(user.id)!;

  let vaccs = await prisma.vacc.findMany();

  // todo: visiting logic

  let shown_vaccs = [];

  for (let vacc of vaccs) {
    if (can(user_roles, vacc.id, user.vaccId, "vacc.own.accessHq")) {
      shown_vaccs.push(vacc);
    }
  }

  return {
    load_error: false,
    shown_vaccs: shown_vaccs,
    user: user,
  };
};
