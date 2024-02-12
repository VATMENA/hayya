import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";
import { getUserRoles } from "$lib/perms/getUserRoles";
import { can } from "$lib/perms/can";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "$lib/components/resources_page/schema";
import { handleResourceSubmit } from "$lib/components/resources_page/action";
import { type Actions } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import { verifyToken } from "$lib/auth";

export const load: PageServerLoad = async ({ cookies }) => {
  if (!cookies.get("hq_token")) {
    redirect(
      301,
      "/",
      { type: "error", message: "You need to be logged in for that" },
      cookies,
    );
  }
  let token = cookies.get("hq_token")!;
  let maybe_cid = verifyToken(token);
  if (maybe_cid === null) {
    redirect(
      301,
      "/",
      { type: "error", message: "You need to be logged in for that" },
      cookies,
    );
  }
  let user = await prisma.user.findUnique({
    where: {
      id: maybe_cid,
    },
  })!;
  if (!user) {
    redirect(
      301,
      "/",
      { type: "error", message: "You need to be logged in for that" },
      cookies,
    );
  }
  let user_roles = await getUserRoles(user.id);

  if (
    can(user_roles!, "division", user.vaccId, `division.resource.viewPrivate`)
  ) {
    return {
      resources: await prisma.resource.findMany({
        where: {
          vaccId: null,
        },
      }),
      form: await superValidate(formSchema),
    };
  } else {
    return {
      resources: await prisma.resource.findMany({
        where: {
          vaccId: null,
          isStaffOnly: false,
        },
      }),
      form: await superValidate(formSchema),
    };
  }
};

export const actions: Actions = {
  create: (e) => handleResourceSubmit(e, null),
};
