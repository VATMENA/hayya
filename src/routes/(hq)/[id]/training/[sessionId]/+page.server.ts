import type { PageServerLoad, Actions } from "./$types";
import prisma from "$lib/prisma";
import { can } from "$lib/perms/can";
import { TRAIN } from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";
import { loadUserData } from "$lib/auth";
import { ulid } from "ulid";
import { superValidate } from "sveltekit-superforms/server";
import { updateDetailsSchema } from "./updateDetailsSchema";
import { zod } from "sveltekit-superforms/adapters";
import { fail } from "@sveltejs/kit";
import {
  parseDate,
  parseDateTime,
  Time,
  toCalendarDate,
  toCalendarDateTime,
} from "@internationalized/date";

export const load: PageServerLoad = async ({ params, parent, cookies }) => {
  let { user } = await parent();

  let session = await prisma.trainingSession.findUnique({
    where: {
      id: params.sessionId,
      facilityId: params.id
    },
    include: {
      mentor: true,
      student: true,
    },
  });

  if (!session) {
    return redirect(
      307,
      `/${params.id}/training`,
      { type: "error", message: "You don't have permission to view that." },
      cookies,
    );
  }

  let canTrain = can(TRAIN);
  let isUsersSession = user.id == session.studentId;

  if (!(canTrain || isUsersSession)) {
    return redirect(
      307,
      `/${params.id}/training`,
      { type: "error", message: "You don't have permission to view that." },
      cookies,
    );
  }

  let dateTime = parseDateTime(
    session.scheduledTime.toISOString().replace("Z", ""),
  );

  let prepopulatedData = {
    scoresheetUrl: session.scoresheetUrl ? session.scoresheetUrl : undefined,
    status: session.status,
    sessionDate: {
      date: toCalendarDate(dateTime).toString(),
      time: {
        hour: dateTime.hour,
        minute: dateTime.minute,
      },
    },
  };

  console.log(prepopulatedData);

  return {
    session,
    comments: await prisma.trainingSessionComment.findMany({
      where: {
        sessionId: session.id,
      },
      include: {
        user: true,
      },
    }),
    canTrain,
    isUsersSession,
    updateForm: await superValidate(prepopulatedData, zod(updateDetailsSchema)),
  };
};

export const actions: Actions = {
  addComment: async (event) => {
    let { user } = await loadUserData(event.cookies, event.params.id);

    let session = await prisma.trainingSession.findUnique({
      where: {
        facilityId: event.params.id,
        id: event.params.sessionId,
      },
      include: {
        mentor: true,
        student: true,
      },
    });

    if (!session) {
      return redirect(
        307,
        `/${event.params.id}/training`,
        { type: "error", message: "You don't have permission to view that." },
        event.cookies,
      );
    }

    let canTrain = can(TRAIN);
    let isUsersSession = user.id == session.studentId;

    if (!(canTrain || isUsersSession)) {
      return redirect(
        307,
        `/${event.params.id}/training`,
        { type: "error", message: "You don't have permission to view that." },
        event.cookies,
      );
    }

    await prisma.trainingSessionComment.create({
      data: {
        id: ulid(),
        sessionId: session.id,
        userId: user.id,
        content: (await event.request.formData()).get("comment")!.toString(),
      },
    });
  },
  deleteSession: async (event) => {
    let { user } = await loadUserData(event.cookies, event.params.id);

    let session = await prisma.trainingSession.findUnique({
      where: {
        facilityId: event.params.id,
        id: event.params.sessionId,
      },
      include: {
        mentor: true,
        student: true,
      },
    });

    if (!session) {
      return redirect(
        307,
        `/${event.params.id}/training`,
        { type: "error", message: "You don't have permission to view that." },
        event.cookies,
      );
    }

    let canTrain = can(TRAIN);

    if (!(canTrain /* || isUsersSession*/)) {
      return redirect(
        307,
        `/${event.params.id}/training`,
        { type: "error", message: "You don't have permission to view that." },
        event.cookies,
      );
    }

    await prisma.trainingSessionComment.deleteMany({
      where: {
        sessionId: session.id,
      },
    });
    await prisma.trainingSession.delete({
      where: {
        id: session.id,
      },
    });
  },
  updateDetails: async (event) => {
    let form = await superValidate(event, zod(updateDetailsSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    let { user } = await loadUserData(event.cookies, event.params.id);

    let session = await prisma.trainingSession.findUnique({
      where: {
        facilityId: event.params.id,
        id: event.params.sessionId,
      },
      include: {
        mentor: true,
        student: true,
      },
    });

    if (!session) {
      return redirect(
        307,
        `/${event.params.id}/training`,
        { type: "error", message: "You don't have permission to view that." },
        event.cookies,
      );
    }

    let canTrain = can(TRAIN);

    if (!(canTrain /* || isUsersSession*/)) {
      return redirect(
        307,
        `/${event.params.id}/training`,
        { type: "error", message: "You don't have permission to view that." },
        event.cookies,
      );
    }

    await prisma.trainingSession.update({
      where: {
        facilityId: event.params.id,
        id: session.id,
      },
      data: {
        scheduledTime:
          toCalendarDateTime(
            parseDate(form.data.sessionDate.date),
            new Time(
              form.data.sessionDate.time.hour,
              form.data.sessionDate.time.minute,
            ),
          ).toString() + "Z",
        status: form.data.status,
        scoresheetUrl: form.data.scoresheetUrl,
      },
    });

    return { form };
  },
};
