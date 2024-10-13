import type { PageServerLoad, Actions } from "./$types";
import { can } from "$lib/perms/can";
import { EDIT_DETAILS, PERMISSIONS } from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { fail } from "@sveltejs/kit";
import { loadUserData } from "$lib/auth";
import prisma from "$lib/prisma";
import { ulid } from "ulid";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({ params, cookies }) => {
  if (!can(EDIT_DETAILS)) {
    redirect(
      307,
      `/${params.id}`,
      { type: "error", message: "You don't have permission for that. (E-1cb6)" },
      cookies,
    );
  }

  return {
    form: await superValidate(zod(formSchema)),
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
      return fail(403, {
        form,
      });
    }

    const permissions = [];

    for (const permission of PERMISSIONS) {
      if (Object.keys(form.data).includes(permission.id)) {
        // @ts-ignore
        if (form.data[permission.id] && can(permission)) {
          permissions.push(permission.id);
        }
      }
    }

    await prisma.role.create({
      data: {
        id: ulid(),
        facilityId: event.params.id,
        name: form.data.name,
        permissions,
        color: form.data.color,
      },
    });

    return {
      form,
    };
  },
};
