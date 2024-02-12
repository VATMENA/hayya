import type { PageServerLoad } from "./$types";
import { redirect } from "sveltekit-flash-message/server";
import { verifyToken } from "$lib/auth";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({ cookies }) => {
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
      301,
      "/",
      { type: "error", message: "You need to be logged in for that" },
      cookies,
    );
  }

  let vaccs = await prisma.vacc.findMany();

  return {
    vaccs: vaccs,
  };
};
