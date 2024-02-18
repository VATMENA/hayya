import type { LayoutServerLoad } from "./$types";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import { verifyToken } from "$lib/auth";
import { getUserRoles } from "$lib/perms/getUserRoles";
import { can } from "$lib/perms/can";

export const load: LayoutServerLoad = async ({ cookies }) => {
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
      id: maybe_cid,
    },
  })!;
  if (!user) {
    redirect(
      307,
      "/",
      { type: "error", message: "You need to be logged in for that." },
      cookies,
    );
  }
  let user_roles = await getUserRoles(user.id)!;

  let vaccs = await prisma.vacc.findMany();

  // todo: visiting logic

  let shown_vaccs = [];

  for (let vacc of vaccs) {
    if (can(user_roles!, vacc.id, user.vaccId, `vacc.${vacc.id}.accessHq`)) {
      shown_vaccs.push(vacc);
    }
  }

  return {
    load_error: false,
    shown_vaccs: shown_vaccs,
    user: user,
  };
};
