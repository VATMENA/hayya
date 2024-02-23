import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import { verifyToken } from "$lib/auth";
import prisma from "$lib/prisma";
import type { User } from "@prisma/client";
import { can } from "$lib/perms/can";
import { setError, superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import {
  C_TYP,
  P_TYP,
  type PositionV2,
  serialize_position_v2,
} from "$lib/cert";
import { page } from "$app/stores";
import { parseDate } from "@internationalized/date";
import {
  ASSIGN_ROLES,
  EXTENDED_ROSTER,
  ISSUE_CERTIFICATE,
  ISSUE_OPENSKIES_CERTIFICATES,
  ISSUE_SOLO_CERTIFICATES,
} from "$lib/perms/permissions";

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
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
    include: {
      heldCertificates: {
        include: {
          instructor: true,
          holder: true,
        },
      },
    },
  });

  let user_roles = await getUserRoles(user!.id);

  let altered_roster = [];

  for (let roster_user of division_roster) {
    if (can(EXTENDED_ROSTER)) {
      // extended. leave as-is
      altered_roster.push(roster_user);
    } else {
      roster_user.name =
        roster_user.name.split(" ")[0] + " (" + roster_user.id + ")";
      altered_roster.push(roster_user);
    }
  }

  let vaccs = await prisma.vacc.findMany();

  let all_roles = await prisma.role.findMany();

  altered_roster = altered_roster.sort((a, b) => {
    if (a.name < b.name) return -1;
    else if (a.name > b.name) return 1;
    else return 0;
  });

  return {
    load_error: false,
    home_users: altered_roster,
    vaccs: vaccs,
    user: user,
    roles: user_roles,
    form: await superValidate(formSchema),
    all_roles: all_roles,
  };
};

export const actions = {
  set_roles: async ({ cookies, request }) => {
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
        id: maybe_cid!,
      },
    })!;
    let user_roles = await getUserRoles(user!.id);

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

    if (!can(ASSIGN_ROLES)) {
      return fail(403, { success: false, error: "unauthorized" });
    }

    await prisma.user.update({
      where: { id: target_user!.id.toString() },
      data: {
        roleIds: data.get("roles")!.toString().split(","),
      },
    });

    return { success: true };
  },
  issue_certificate: async (event) => {
    const form = await superValidate(event, formSchema);
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    console.log(form.data);

    if (!event.cookies.get("hq_token")) {
      redirect(
        301,
        "/",
        { type: "error", message: "You need to be logged in for that" },
        event,
      );
    }
    let token = event.cookies.get("hq_token")!;
    let maybe_cid = verifyToken(token);
    if (maybe_cid === null) {
      redirect(
        301,
        "/",
        { type: "error", message: "You need to be logged in for that" },
        event,
      );
    }
    let user = await prisma.user.findUnique({
      where: {
        id: maybe_cid!,
      },
    })!;
    let user_roles = await getUserRoles(user!.id);

    let targetUser = await prisma.user.findUnique({
      where: {
        id: form.data.id,
      },
    })!;

    let has_solo_permission = can(ISSUE_SOLO_CERTIFICATES);
    let has_perm_permission = can(ISSUE_CERTIFICATE);

    if (form.data.c_typ === C_TYP.Solo && !has_solo_permission) {
      return setError(
        form,
        "c_typ",
        "Not authorized to issue this type of certificate",
      );
    } else if (form.data.c_typ === C_TYP.Permanent && !has_perm_permission) {
      return setError(
        form,
        "c_typ",
        "Not authorized to issue this type of certificate",
      );
    }

    let has_openskies_permission = can(ISSUE_OPENSKIES_CERTIFICATES);
    if (form.data.p_typ === P_TYP.OpenSkies && !has_openskies_permission) {
      return setError(
        form,
        "p_typ",
        "Not authorized to issue this type of certificate",
      );
    }

    // valid & authorized, issue the certificate

    // create the PositionV2 and serialize to a permission specifier
    let pv2: PositionV2 = {
      c_typ: form.data.c_typ,
      p_typ: form.data.p_typ,
      facility: form.data.facility === undefined ? null : form.data.facility,
      position: form.data.pos === undefined ? null : form.data.pos,
    };
    let position_specifier = serialize_position_v2(pv2)!;

    let date = form.data.solo_expires
      ? parseDate(form.data.solo_expires).toDate("UTC")
      : undefined;

    await prisma.certificate.create({
      data: {
        holderId: targetUser!.id,
        instructorId: user!.id,
        position: position_specifier,
        expires: date,
        instructorComments: form.data.comments,
        issuedInId: user!.vaccId || targetUser!.vaccId!,
      },
    });

    return {
      form,
    };
  },
} satisfies Actions;
