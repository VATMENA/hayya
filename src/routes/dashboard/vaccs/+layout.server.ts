import type { LayoutServerLoad } from "./$types";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import { verifyToken } from "$lib/auth";

export const load: LayoutServerLoad = async ({ cookies }) => {
  let vaccs = await prisma.vacc.findMany();

  return {
    vaccs: vaccs,
  };
};
