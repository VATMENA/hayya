import type { PageServerLoad, Actions } from "./$types";
import { can } from "$lib/perms/can";
import { MANAGE_TV_REQUESTS } from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import { setError, superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { loadUserData } from "$lib/auth";
import { fail } from "@sveltejs/kit";
import { ulid } from "ulid";

export const load: PageServerLoad = async ({ params, cookies }) => {
  if (!can(MANAGE_TV_REQUESTS)) {
    redirect(
      307,
      `/${params.id}`,
      { type: "error", message: "You don't have permission for that. (E-cf2c)" },
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

export const actions: Actions = {
  manAssign: async (event) => {
    await loadUserData(event.cookies, event.params.id);

    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    if (!can(MANAGE_TV_REQUESTS)) {
      return fail(401, { form });
    }

    // try to find the user
    let user = await prisma.user.findUnique({
      where: {
        id: form.data.cid,
      },
    });
    if (!user) {
      return setError(
        form,
        "cid",
        "Could not find user. They might need to log into Hayya first.",
      );
    }

    await prisma.userFacilityAssignment.create({
      data: {
        id: ulid(),
        facilityId: event.params.id,
        userId: user.id,
        assignmentType: "Secondary",
      },
    });

    return { form };
  },
};
