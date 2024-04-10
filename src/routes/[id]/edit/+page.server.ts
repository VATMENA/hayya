import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { fail } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { loadUserData } from "$lib/auth";
import { can } from "$lib/perms/can";
import { EDIT_DETAILS } from "$lib/perms/permissions";
import prisma from "$lib/prisma";
import { redirect } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async ({ params, cookies }) => {
  let form = await superValidate(zod(formSchema));

  let facility = await prisma.facility.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!facility) {
    return redirect(
      307,
      "/select_hq",
      {
        type: "error",
        message: "Couldn't find that facility, please select another.",
      },
      cookies,
    );
  }

  form.data.name = facility.name;
  form.data.website = facility.website;
  form.data.contact_email = facility.contactEmail;

  return {
    form,
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    await loadUserData(event.cookies, event.params.id);
    if (!can(EDIT_DETAILS)) {
      return fail(403, { form });
    }

    await prisma.facility.update({
      where: {
        id: event.params.id,
      },
      data: {
        name: form.data.name,
        website: form.data.website,
        contactEmail: form.data.contact_email,
      },
    });

    return { form };
  },
};
