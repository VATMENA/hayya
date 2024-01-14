import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { verifyToken } from "$lib/auth";
import prisma from "$lib/prisma";
import type { User } from "@prisma/client";
import { can } from "$lib/perms/can";
import { getUserRoles } from "$lib/perms/getUserRoles";

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
  if (!cookies.get("hq_token")) {
    redirect(301, "/");
  }
  let token = cookies.get("hq_token")!;
  let maybe_cid = verifyToken(token);
  if (maybe_cid === null) {
    redirect(301, "/");
  }
  let user = await prisma.user.findUnique({
    where: {
      id: maybe_cid!,
    },
  })!;

  // Privacy stuff

  let division_roster: User[] = await prisma.user.findMany({
    where: {
      NOT: {
        ratingShort: "SUS",
      },
      division: "MENA",
      vaccId: params.id,
    },
  });

  let user_roles = await getUserRoles(user.id);

  let altered_roster = [];

  for (let roster_user of division_roster) {
    if (
      can(
        user_roles,
        roster_user.vaccId,
        user.vaccId,
        `vacc.${roster_user.vaccId}.roster.extended`,
      )
    ) {
      // extended. leave as-is
      altered_roster.push(roster_user);
    } else {
      roster_user.name =
        roster_user.name.split(" ")[0] + " (" + roster_user.id + ")";
      altered_roster.push(roster_user);
    }
  }

  let vaccs = await prisma.vacc.findMany();

  return {
    load_error: false,
    home_users: altered_roster,
    vaccs: vaccs,
    user: user,
    roles: user_roles,
  };
};

export const actions = {
  set_roles: async ({ cookies, request }) => {
    if (!cookies.get("hq_token")) {
      redirect(301, "/");
    }
    let token = cookies.get("hq_token")!;
    let maybe_cid = verifyToken(token);
    if (maybe_cid === null) {
      redirect(301, "/");
    }
    let user = await prisma.user.findUnique({
      where: {
        id: maybe_cid!,
      },
    })!;
    let user_roles = await getUserRoles(user.id);

    let data = await request.formData();

    if (!data.has("user")) {
      return fail(400, { success: false, error: "missing user" });
    }
    if (!data.has("roles")) {
      return fail(400, { success: false, error: "missing roles" });
    }

    let target_user = await prisma.user.findUnique({
      where: {
        id: data.get("user")!.toString(),
      },
    })!;

    if (
      !can(
        user_roles,
        target_user.vaccId,
        user.vaccId,
        `vacc.${target_user.vaccId}.role.assign`,
      )
    ) {
      return fail(403, { success: false, error: "unauthorized" });
    }

    await prisma.user.update({
      where: { id: target_user.id.toString() },
      data: {
        roleIds: data.get("roles")!.toString().split(","),
      },
    });

    return { success: true };
  },
} satisfies Actions;
