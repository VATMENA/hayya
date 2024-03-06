import type { LayoutServerLoad } from "./$types";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import { loadUserData } from "$lib/auth";

export const load: LayoutServerLoad = async ({ cookies }) => {
  await loadUserData(cookies, null);

  let facils = await prisma.facility.findMany();

  return {
    facilities: facils,
  };
};
