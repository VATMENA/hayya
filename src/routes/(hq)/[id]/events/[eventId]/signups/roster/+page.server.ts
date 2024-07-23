import { loadUserData } from "$lib/auth";
import { can } from "$lib/perms/can";
import { MANAGE_EVENTS } from "$lib/perms/permissions";
import prisma from "$lib/prisma";
import { redirect } from "sveltekit-flash-message/server";
import type { PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./create-form";
import { fail, type Actions } from "@sveltejs/kit";
import { ulid } from "ulid";
import { goto } from "$app/navigation";

export const load: PageServerLoad = async ({ params, cookies }) => {
  await loadUserData(cookies, null);

  if (!can(MANAGE_EVENTS)) {
    redirect(
      307,
      `/${params.id}/events/${params.eventId}`,
      {
        type: "error",
        message: "You do not have permission to do this",
      },
      cookies,
    );
  }

  const event = await prisma.event.findUniqueOrThrow({
    where: {
      id: params.eventId,
    },
    include: {
      signups: {
        include: {
          user: true,
        },
      },
      assignments: {
        include: {
          user: {
            select: {
              name: true,
              ratingShort: true,
            },
          },
        },
      },
    },
  });

  let createForm = await superValidate(zod(formSchema));

  return {
    event,
    createForm,
  };
};

export const actions: Actions = {
  createAssignment: async (event) => {
    const { user } = await loadUserData(event.cookies, null);
    const form = await superValidate(event, zod(formSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const eventObj = await prisma.event.findUniqueOrThrow({
      where: {
        id: event.params.eventId,
      },
    });

    await prisma.eventAssignment.create({
      data: {
        id: ulid(),
        eventId: event.params.eventId || "",
        userId: form.data.userId,
        assignedPosition: form.data.position,
        positionDetails: "",
        startTime: eventObj.start,
        endTime: new Date(eventObj.start.getTime() + 60 * 60 * 1000),
      },
    });

    return {
      form,
    };
  },

  saveRoster: async (event) => {
    const data = JSON.parse(
      (await event.request.formData()).get("events") as string,
    );

    data.forEach(async (assignment: any) => {
      await prisma.eventAssignment.update({
        where: {
          id: assignment.id,
        },
        data: {
          startTime: assignment.start,
          endTime: assignment.end,
          assignedPosition: assignment.extendedProps.assignedPosition,
        },
      });
    });

    return redirect(
      302,
      `/${event.params.id}/events/${event.params.eventId}/signups/roster`,
    );
  },

  deleteAssignment: async (event) => {
    const assignmentId = (await event.request.formData()).get("assignmentId");

    await prisma.eventAssignment.delete({
      where: {
        id: assignmentId as string,
      },
    });

    return redirect(
      302,
      `/${event.params.id}/events/${event.params.eventId}/signups/roster`,
    );
  },
};
