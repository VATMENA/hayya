import { verifyToken } from "$lib/auth";
import prisma from "$lib/prisma";
import { redirect } from "sveltekit-flash-message/server";
import type { PageServerLoad } from "./$types";
import type { Role } from "@prisma/client";
import { loadFlash } from "sveltekit-flash-message/server";

export const load: PageServerLoad = loadFlash(async ({ cookies }) => {
  if (!cookies.get("hq_token")) {
    return;
  }

  let token = cookies.get("hq_token")!;
  let maybe_cid = verifyToken(token);

  if (maybe_cid === null) {
    cookies.delete("hq_token", { path: "/" });
    return;
  }

  let cid = maybe_cid!;

  let user = await prisma.user.findUnique({
    where: { id: cid },
    include: {
      vacc: true,
    },
  });

  if (!user) {
    cookies.delete("hq_token", { path: "/" });
    return;
  }

  redirect(
    307,
    "/switch_hq",
    { type: "success", message: `Welcome, ${user.name}!` },
    cookies,
  );
});
