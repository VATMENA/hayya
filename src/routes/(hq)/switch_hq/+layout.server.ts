import type { LayoutServerLoad } from "./$types";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import { verifyToken } from "$lib/auth";

export const load: LayoutServerLoad = async ({ cookies }) => {
  if (!cookies.get("hq_token")) {
    redirect(
      301,
      "/",
      { type: "error", message: "You need to be logged in for that. (E-9241)" },
      cookies,
    );
  }

  const token = cookies.get("hq_token")!;
  const maybe_cid = verifyToken(token);
  if (maybe_cid === null) {
    redirect(
      301,
      "/",
      { type: "error", message: "You need to be logged in for that. (E-fe98)" },
      cookies,
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: maybe_cid,
    },
    include: {
      facilities: {
        include: {
          facility: true,
        },
      },
    },
  })!;
  if (!user) {
    redirect(
      307,
      "/",
      { type: "error", message: "You need to be logged in for that. (E-cc73)" },
      cookies,
    );
  }

  const all_facilities = await prisma.facility.findMany();

  return {
    user: user,
    facilities: all_facilities,
  };
};
