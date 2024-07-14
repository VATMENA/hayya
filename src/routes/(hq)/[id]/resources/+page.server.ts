import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import type { PageServerLoad, Actions } from "./$types";
import { can } from "$lib/perms/can";
import { loadUserData } from "$lib/auth";
import {
  MANAGE_RESOURCES,
  VIEW_PRIVATE_RESOURCES,
} from "$lib/perms/permissions";
import { fail } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { ulid } from "ulid";

export const load: PageServerLoad = async ({ params }) => {
  let resources;

  if (!can(VIEW_PRIVATE_RESOURCES)) {
    resources = await prisma.resource.findMany({
      where: {
        facilityId: params.id,
        isStaffOnly: false,
      },
    });
  } else {
    resources = await prisma.resource.findMany({
      where: {
        facilityId: params.id,
      },
    });
  }

  return {
    form: await superValidate(zod(formSchema)),
    resources,
  };
};

export const actions: Actions = {
  create: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    await loadUserData(event.cookies, event.params.id);

    if (!can(MANAGE_RESOURCES)) {
      return fail(403, { form });
    }

    await prisma.resource.create({
      data: {
        id: ulid(),
        name: form.data.name,
        description: form.data.description,
        facilityId: event.params.id,
        isStaffOnly: !form.data.isPublic,
        link: form.data.url,
      },
    });

    return { form };
  },
  delete: async (event) => {
    await loadUserData(event.cookies, event.params.id);

    if (!can(MANAGE_RESOURCES)) {
      return fail(403, {});
    }

    const data = await event.request.formData();

    const id = data.get("id")!.toString();

    await prisma.resource.delete({
      where: {
        id: id,
        facilityId: event.params.id,
      },
    });

    return {};
  },
};
