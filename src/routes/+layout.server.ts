import { verifyToken } from "$lib/auth";
import prisma from "$lib/prisma";
import { redirect } from "sveltekit-flash-message/server";
import type { LayoutServerLoad } from "./$types";
import type { Role } from "@prisma/client";
import { loadFlash } from "sveltekit-flash-message/server";

export const load: LayoutServerLoad = loadFlash(async ({ cookies }) => {
  if (!cookies.get("hq_token")) {
    return {
      loggedin: false,
      user: null,
      roles: null,
    };
  }

  let token = cookies.get("hq_token")!;
  let maybe_cid = verifyToken(token);

  if (maybe_cid === null) {
    return {
      loggedin: false,
      user: null,
      roles: null,
    };
  }

  let cid = maybe_cid!;

  let user = await prisma.user.findUnique({
    where: { id: cid },
    include: {
      vacc: true,
    },
  });

  let roles: Role[] = [];

  if (!user) {
    redirect(
      301,
      "/",
      { type: "error", message: "You need to be logged in for that" },
      cookies,
    );
  }

  for (let roleId of user.roleIds) {
    let role = await prisma.role.findUnique({ where: { id: roleId } });
    if (role) {
      roles.push(role);
    }
  }

  return {
    loggedin: true,
    user: user,
    roles: roles,
  };
});
