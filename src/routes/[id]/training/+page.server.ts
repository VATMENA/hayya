import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./session-form";
import type { PageServerLoad } from "./$types";
import { type Actions, fail } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import { verifyToken } from "$lib/auth";
import prisma from "$lib/prisma";
import { getUserRoles } from "$lib/perms/getUserRoles";
import { can } from "$lib/perms/can";
import { ulid } from "ulid";
import { parseDate, parseDateTime } from "@internationalized/date";
import { TRAIN } from "$lib/perms/permissions";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(formSchema),
  };
};

export const actions: Actions = {
  logSession: async (event) => {
    const form = await superValidate(event, formSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

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
        id: form.data.cid,
      },
    })!;

    if (!can(TRAIN)) {
      redirect(
        301,
        "/",
        { type: "error", message: "You need to be logged in for that" },
        event,
      );
    }

    let date = parseDateTime(form.data.date.replace("Z", "")).toDate("UTC");

    await prisma.session.create({
      data: {
        id: ulid(),
        studentId: targetUser!.id,
        instructorId: user!.id,
        sessionType: form.data.sessionType,
        studentComments: form.data.studentComments,
        instructorComments: form.data.mentorComments,
        date: date,
      },
    });

    return {
      form,
    };
  },
};
