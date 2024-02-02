import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { fail, redirect } from "@sveltejs/kit";
import { can } from "$lib/perms/can";
import { verifyToken } from "$lib/auth";
import prisma from "$lib/prisma";
import { getUserRoles } from "$lib/perms/getUserRoles";
import { ulid } from "ulid";

export async function handleResourceSubmit(event: any, vaccId: string | null) {
  const form = await superValidate(event, formSchema);
  if (!form.valid) {
    return fail(400, {
      form,
    });
  }

  if (!event.cookies.get("hq_token")) {
    redirect(301, "/");
  }
  let token = event.cookies.get("hq_token")!;
  let maybe_cid = verifyToken(token);
  if (maybe_cid === null) {
    redirect(301, "/");
  }
  let user = await prisma.user.findUnique({
    where: {
      id: maybe_cid!,
    },
  })!;
  let user_roles = await getUserRoles(user!.id);

  let hasEdit = vaccId
    ? can(user_roles!, vaccId, user!.vaccId, `vacc.${vaccId}.resource.manage`)
    : can(user_roles!, vaccId, user!.vaccId, `division.resource.manage`);

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
