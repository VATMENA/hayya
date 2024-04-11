import type { PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(formSchema)),
    facilities: await prisma.facility.findMany({})!,
  };
};
