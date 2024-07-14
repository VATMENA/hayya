import { verifyToken } from "$lib/auth";
import prisma from "$lib/prisma";
import { redirect } from "sveltekit-flash-message/server";
import type { PageServerLoad } from "./$types";
import { loadFlash } from "sveltekit-flash-message/server";

export const load: PageServerLoad = loadFlash(async ({ cookies }) => {
  if (!cookies.get("hq_token")) {
    return;
  }

  const token = cookies.get("hq_token")!;
  const maybe_cid = verifyToken(token);

  if (maybe_cid === null) {
    cookies.delete("hq_token", { path: "/" });
    return;
  }

  const cid = maybe_cid!;

  const user = await prisma.user.findUnique({
    where: { id: cid },
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
