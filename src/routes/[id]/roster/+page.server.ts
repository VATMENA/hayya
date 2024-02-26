import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import { loadUserData, verifyToken } from "$lib/auth";
import prisma from "$lib/prisma";
import type { User, UserFacilityAssignment } from "@prisma/client";
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
  let { user } = await loadUserData(cookies, params.id);

  // Privacy stuff

  let roster: UserFacilityAssignment[] = await prisma.userFacilityAssignment.findMany({
    where: {
      facilityId: params.id,
    },
    include: {
      user: {
        include: {
          heldCertificates: {
            include: {
              instructor: true
            }
          }
        }
      },
      roles: true
    },
  });

  let altered_roster = [];

  for (let roster_user of roster) {
    if (can(EXTENDED_ROSTER)) {
      // extended. leave as-is
      altered_roster.push(roster_user);
    } else {
      roster_user.user.name =
        roster_user.user.name.split(" ")[0] + " (" + roster_user.userId + ")";
      altered_roster.push(roster_user);
    }
  }

  altered_roster = altered_roster.sort((a, b) => {
    if (a.name < b.name) return -1;
    else if (a.name > b.name) return 1;
    else return 0;
  });

  return {
    users: altered_roster,
    form: await superValidate(formSchema),
  };
};

export const actions = {
  set_roles: async ({ cookies, params, request }) => {
    await loadUserData(cookies, params.id);

    let data = await request.formData();

    if (!data.has("target")) {
      return fail(400, { success: false, error: "missing target" });
    }
    if (!data.has("roles")) {
      return fail(400, { success: false, error: "missing roles" });
    }

    if (!can(ASSIGN_ROLES)) {
      return fail(403, { success: false, error: "unauthorized" });
    }

    let newRoles = data.get("roles")!.toString().split(",").map((u) => {return {id: u}});
    if (data.get("roles")!.toString() === "") {
      newRoles = [];
    }

    await prisma.userFacilityAssignment.update({
      where: {
        id: data.get("target")!.toString()
      },
      data: {
        roles: {
          set: newRoles
        },
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

    if (!event.cookies.get("hq_token")) {
      redirect(
        301,
        "/",
        { type: "error", message: "You need to be logged in for that" },
        event,
      );
    }

    let { user } = await loadUserData(event.cookies, event.params.id);

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
        issuedInId: event.params.id,
      },
    });

    return {
      form,
    };
  },
} satisfies Actions;
