import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { fail } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import { can } from "$lib/perms/can";
import { loadUserData, verifyToken } from "$lib/auth";
import prisma from "$lib/prisma";
import { ulid } from "ulid";
import { MANAGE_RESOURCES } from "$lib/perms/permissions";

export async function handleResourceSubmit(
  event: any,
  facilityId: string | null,
) {
  const form = await superValidate(event, formSchema);
  if (!form.valid) {
    return fail(400, {
      form,
    });
  }

  await loadUserData(event.cookies, event.params.id);

  let hasEdit = can(MANAGE_RESOURCES);

  if (!hasEdit) {
    return fail(403, {
      form,
    });
  }

  await prisma.resource.create({
    data: {
      id: ulid(),
      facilityId: facilityId,
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
