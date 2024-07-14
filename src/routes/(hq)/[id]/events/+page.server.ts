import type { PageServerLoad, Actions } from "./$types";
import prisma from "$lib/prisma";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { fail } from "@sveltejs/kit";
import { loadUserData } from "$lib/auth";
import { can } from "$lib/perms/can";
import { redirect } from "sveltekit-flash-message/server";
import { getPixels } from "@unpic/pixels";
import { encode } from "blurhash";
import { ulid } from "ulid";
import { MANAGE_EVENTS } from "$lib/perms/permissions";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({ params }) => {
  const events = await prisma.event.findMany({
    where: {
      hostId: params.id,
    },
  });

  return {
    events,
    form: await superValidate(zod(formSchema)),
  };
};

export const actions: Actions = {
  create: async (event) => {
    const form = await superValidate(event, zod(formSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    await loadUserData(event.cookies, event.params.id);

    if (!can(MANAGE_EVENTS)) {
      return redirect(
        307,
        `/${event.params.id}/`,
        { message: "You don't have permission to do that.", type: "error" },
        event.cookies,
      );
    }

    // combine the datetimes

    const startDate = new Date(form.data.startDate);
    const startTime = String(form.data.startTime).padStart(4, "0");
    const startHour = Number.parseInt(startTime.slice(0, 2));
    const startMinute = Number.parseInt(startTime.slice(2));
    startDate.setHours(startHour, startMinute);

    const endDate = new Date(form.data.endDate);
    const endTime = String(form.data.endTime).padStart(4, "0");
    const endHour = Number.parseInt(endTime.slice(0, 2));
    const endMinute = Number.parseInt(endTime.slice(2));
    endDate.setHours(endHour, endMinute);

    // generate the blurhash

    const imageData = await getPixels(form.data.bannerUrl);
    const data = Uint8ClampedArray.from(imageData.data);
    const blurhash = encode(data, imageData.width, imageData.height, 4, 4);

    await prisma.event.create({
      data: {
        id: ulid(),
        name: form.data.name,
        hostId: event.params.id,
        start: startDate,
        end: endDate,
        description: form.data.description,
        bannerUrl: form.data.bannerUrl,
        bannerBlurHash: blurhash,
        positions: [],
        public: false,
        allowSignups: false,
      },
    });

    return {
      form,
    };
  },
  setVisibility: async (event) => {
    await loadUserData(event.cookies, event.params.id);

    if (!can(MANAGE_EVENTS)) {
      return redirect(
        307,
        `/${event.params.id}/`,
        { message: "You don't have permission to do that.", type: "error" },
        event.cookies,
      );
    }

    const data = await event.request.formData();

    if (!data.has("eventId") || !data.has("public")) {
      return { success: false };
    } else {
      const id = data.get("eventId")!.toString();
      const isPublic = data.get("public")!.toString() === "true";
      await prisma.event.update({
        where: {
          id,
        },
        data: {
          public: isPublic,
        },
      });
      return { success: true };
    }
  },
};
