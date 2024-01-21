import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { verifyToken } from "$lib/auth";

export const load: LayoutServerLoad = async ({ cookies }) => {
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

  let vaccs = await prisma.vacc.findMany();

  return {
    load_error: false,
    vaccs: vaccs,
    user: user,
  };
};
