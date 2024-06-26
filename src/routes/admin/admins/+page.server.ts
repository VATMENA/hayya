import type { PageServerLoad, Actions } from "./$types";
import prisma from "$lib/prisma";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { fail } from "@sveltejs/kit";
import { loadUserData } from "$lib/auth";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({ parent }) => {
  const { user } = await parent();
  if (!user.isSiteAdmin) {
    return {};
  }

  return {
    users: await prisma.user.findMany({
      where: {
        isSiteAdmin: true,
      },
    }),
    form: await superValidate(zod(formSchema)),
  };
};

export const actions: Actions = {
  create: async (event) => {
    const form = await superValidate(event, zod(formSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { user } = await loadUserData(event.cookies, null);
    if (!user.isSiteAdmin) {
      return fail(400, { form });
    }

    await prisma.user.update({
      where: {
        id: form.data.cid,
      },
      data: {
        isSiteAdmin: true,
      },
    });

    return {
      form,
    };
  },
  delete: async (event) => {
    const { user } = await loadUserData(event.cookies, null);
    if (!user.isSiteAdmin) {
      return fail(400, {});
    }

    await prisma.user.update({
      where: {
        id: (await event.request.formData()).get("id")!.toString(),
      },
      data: {
        isSiteAdmin: false,
      },
    });
  },
};
