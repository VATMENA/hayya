import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { fail } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import { can } from "$lib/perms/can";
import { loadUserData, verifyToken } from "$lib/auth";
import prisma from "$lib/prisma";
import { ulid } from "ulid";

export async function handleResourceSubmit(event: any, vaccId: string | null) {
  const form = await superValidate(event, formSchema);
  if (!form.valid) {
    return fail(400, {
      form,
    });
  }

  let { user, roles } = await loadUserData(event.cookies);

  let hasEdit = vaccId
    ? can(roles, vaccId, user.vaccId, `vacc.${vaccId}.resource.manage`)
    : can(roles, vaccId, user.vaccId, `division.resource.manage`);

  if (!hasEdit) {
    return fail(403, {
      form,
    });
  }

  await prisma.resource.create({
    data: {
      id: ulid(),
      vaccId: vaccId,
      name: form.data.name,
      link: form.data.link,
      description: form.data.description,
      isStaffOnly: form.data.private,
    },
  });

  return {
    form,
  };
}
