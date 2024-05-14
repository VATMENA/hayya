import { loadUserData } from "$lib/auth";
import { can } from "$lib/perms/can";
import { MANAGE_EVENTS } from "$lib/perms/permissions";
import prisma from "$lib/prisma";
import { redirect } from "sveltekit-flash-message/server";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./edit-form";
import { zod } from "sveltekit-superforms/adapters";

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

  const event = await prisma.event.findUnique({
    where: {
      id: params.eventId,
    },
  });

  let editForm = await superValidate(zod(formSchema));

  return {
    event,
    editForm,
  };
};

export const actions: Actions = {
  editEvent: async (event) => {
    const form = await superValidate(event, zod(formSchema));

    let positions = form.data.positions.split(",");
    if (positions[0] == "") positions = [];

    await prisma.event.update({
      where: {
        id: event.params.eventId,
      },
      data: {
        name: form.data.name,
        description: form.data.description,
        public: form.data.public,
        allowSignups: form.data.allowSignups,
        positions: form.data.allowSignups ? positions : [],
      },
    });

    if (!form.data.allowSignups) {
      await prisma.eventSignup.deleteMany({
        where: {
          eventId: event.params.eventId,
        },
      });
    }

    redirect(
      301,
      `/${event.params.id}/events/${event.params.eventId}`,
      {
        type: "success",
        message: "Event configuration updated successfully",
      },
      event.cookies,
    );

    return {
      form,
    };
  },
};
