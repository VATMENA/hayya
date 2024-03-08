import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./session-form";
import { formSchema as requestFormSchema } from "./request-form";
import type { PageServerLoad } from "./$types";
import { type Actions, fail } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import { loadUserData, verifyToken } from "$lib/auth";
import prisma from "$lib/prisma";
import { can } from "$lib/perms/can";
import { ulid } from "ulid";
import { parseDate, parseDateTime } from "@internationalized/date";
import { TRAIN } from "$lib/perms/permissions";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(formSchema),
    requestForm: await superValidate(requestFormSchema),
  };
};

export const actions: Actions = {
  logSession: async (event) => {
    const form = await superValidate(event, formSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    let { user } = await loadUserData(event.cookies, event.params.id!);

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
  requestTraining: async (event) => {
    const form = await superValidate(event, requestFormSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    let { user } = await loadUserData(event.cookies, event.params.id!);

    let startDate = parseDateTime(form.data.dateStart.replace("Z", "")).toDate("UTC");
    let endDate = parseDateTime(form.data.dateEnd.replace("Z", "")).toDate("UTC");


    await prisma.trainingRequest.create({
      data: {
        id: ulid(),
        facilityId: event.params.id!,
        studentId: user.id,
        instructorId: null,
        trainingType: form.data.trainingType,
        startDate: startDate,
        endDate: endDate,
        availability: form.data.times
      },
    });

    return {
      form,
    };
  }
};
