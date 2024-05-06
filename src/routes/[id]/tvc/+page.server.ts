import type { PageServerLoad } from "./$types";
import { can } from "$lib/perms/can";
import { MANAGE_TV_REQUESTS } from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({ params, cookies }) => {
  if (!can(MANAGE_TV_REQUESTS)) {
    redirect(
      307,
      `/${params.id}`,
      { type: "error", message: "You don't have permission for that." },
      cookies,
    );
  }

  let cases = await prisma.tVCase.findMany({
    where: {
      facilityId: params.id,
    },
  });

  return {
    cases,
    form: await superValidate(zod(formSchema)),
  };
};
