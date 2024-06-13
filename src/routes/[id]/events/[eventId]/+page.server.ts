import prisma from "$lib/prisma.js";
import { superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types.js";
import { formSchema } from "./signup-form.js";
import { loadUserData } from "$lib/auth.js";
import { ulid } from "ulid";
import { redirect } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({ params, cookies }) => {
  const { user } = await loadUserData(cookies, params.id);

  const event = await prisma.event.findUnique({
    where: {
      id: params.eventId,
    },
    include: {
      signups: true,
      assignments: true,
    },
  });

  let signup = event?.signups.find((signup) => {
    return signup.userId == user.id;
  });

  return {
    event,
    signupForm: await superValidate(zod(formSchema)),
    signup,
  };
};

export const actions: Actions = {
  signup: async (event) => {
    const { user } = await loadUserData(event.cookies, null);

    const form = await superValidate(event, zod(formSchema));
    const eventObj = await prisma.event.findUnique({
      where: {
        id: event.params.eventId,
      },
    });

    if (!eventObj) return;

    let availableFrom = eventObj.start;
    let availableTo = eventObj.end;

    if (form.data.availableFrom) {
      availableFrom.setUTCHours(parseInt(form.data.availableFrom.slice(0, 2)));
      availableFrom.setUTCMinutes(
        parseInt(form.data.availableFrom.slice(2, 4)),
      );
    }

    if (form.data.availableTo) {
      availableTo.setUTCHours(parseInt(form.data.availableTo.slice(0, 2)));
      availableTo.setUTCMinutes(parseInt(form.data.availableTo.slice(2, 4)));
    }

    await prisma.eventSignup.create({
      data: {
        id: ulid(),
        userId: user.id,
        eventId: eventObj.id,
        desiredPosition: form.data.desiredPosition,
        availableFrom: availableFrom,
        availableTo: availableTo,
        comments: form.data.comments,
      },
    });

    return {
      form,
    };
  },
  cancelSignup: async (event) => {
    const { user } = await loadUserData(event.cookies, null);

    await prisma.eventSignup.deleteMany({
      where: {
        userId: user.id,
        eventId: event.params.eventId,
      },
    });

    redirect(301, `/${event.params.id}/events`);
  },
};
