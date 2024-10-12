import type { PageServerLoad, Actions } from "./$types";
import { can } from "$lib/perms/can";
import { MANAGE_TRAINING_PLANS, TRAIN } from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { fail } from "@sveltejs/kit";
import { loadUserData } from "$lib/auth";
import { ulid } from "ulid";
import { upgradeSchema } from "./upgradeSchema";
import { parseDate, Time, toCalendarDateTime } from "@internationalized/date";

export const load: PageServerLoad = async ({ params, cookies }) => {
  if (!can(TRAIN)) {
    redirect(
      307,
      `/${params.id}`,
      { type: "error", message: "You don't have permission to do that." },
      cookies,
    );
  }

  return {
    requests: await prisma.trainingRequest.findMany({
      where: {
        facilityId: params.id,
      },
      include: {
        registration: {
          include: {
            user: true,
            plan: true,
          },
        },
      },
    }),
    upgradeForm: await superValidate(zod(upgradeSchema)),
  };
};

export const actions: Actions = {
  cancelRequest: async (event) => {
    let { user } = await loadUserData(event.cookies, event.params.id);
    await prisma.trainingRequest.deleteMany({
      where: {
        id: (await event.request.formData()).get("id")!.toString(),
        facilityId: event.params.id
      },
    });
  },
  upgradeRequest: async (event) => {
    let form = await superValidate(event, zod(upgradeSchema));

    if (!form.valid) {
      console.log("fail: invalid form");
      return fail(400, { form });
    }

    let { user } = await loadUserData(event.cookies, event.params.id);
    if (!can(TRAIN)) {
      console.log("fail: no permission");
      return fail(400, { form });
    }

    let request = await prisma.trainingRequest.findUnique({
      where: {
        id: form.data.requestId,
        facilityId: event.params.id
      },
      include: {
        registration: {
          include: {
            user: true,
            plan: true,
          },
        },
      },
    });

    console.log(form.data.requestId);
    console.log(request);

    if (!request) {
      console.log("fail: no request");
      return fail(400, { form });
    }

    let session = await prisma.trainingSession.create({
      data: {
        id: ulid(),
        facilityId: event.params.id,
        planId: request.registration.plan.id,
        studentId: request.registration.user.id,
        mentorId: user.id,
        name: request.registration.plan.name,
        scheduledTime:
          toCalendarDateTime(
            parseDate(form.data.sessionDate.date),
            new Time(
              form.data.sessionDate.time.hour,
              form.data.sessionDate.time.minute,
            ),
          ).toString() + "Z",
        status: "Scheduled",
        scoresheetUrl: form.data.scoresheetUrl,
      },
    });

    await prisma.trainingRequest.delete({
      where: {
        id: request.id,
        facilityId: event.params.id
      },
    });

    return redirect(
      307,
      `/${event.params.id}/training/${session.id}`,
      { type: "success", message: "Session scheduled successfully!" },
      event,
    );
  },
};
