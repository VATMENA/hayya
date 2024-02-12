import { verifyToken } from "$lib/auth";
import prisma from "$lib/prisma";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import type {Role} from "@prisma/client";

export const load: LayoutServerLoad = async ({ cookies }) => {
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
    redirect(307, "/");
  }

  for (let roleId of user.roleIds) {
    let role = await prisma.role.findUnique({where: { id: roleId }});
    if (role) {
      roles.push(role);
    }
  }

  return {
    loggedin: true,
    user: user,
    roles: roles,
  };
};
