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
      { type: "error", message: "You don't have permission for that. (E-9fce)" },
      cookies,
    );
  }

  const role = await prisma.role.findUnique({
    where: {
      id: params.roleId,
      facilityId: params.id,
    },
  });

  if (!role) {
    return redirect(
      307,
      `/${params.id}/manage`,
      { type: "error", message: "Could not find that role." },
      cookies,
    );
  }

  const form = await superValidate(zod(formSchema));

  form.data.color = role.color;
  form.data.name = role.name;

  for (const permission of role.permissions) {
    // @ts-ignore
    form.data[permission] = true;
  }

  console.log(form.data);

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

    await prisma.role.update({
      where: {
        id: event.params.roleId,
        facilityId: event.params.id,
      },
      data: {
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
