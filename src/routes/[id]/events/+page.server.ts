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
import type { Config } from "@sveltejs/adapter-vercel";
import { MANAGE_EVENTS } from "$lib/perms/permissions";

export const config: Config = {
  maxDuration: 300,
};

export const load: PageServerLoad = async ({ params }) => {
  let events = await prisma.event.findMany({
    where: {
      hostId: params.id,
    },
  });

  return {
    events,
    form: await superValidate(formSchema),
  };
};

export const actions: Actions = {
  create: async (event) => {
    const form = await superValidate(event, formSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    let { user, roles } = await loadUserData(event.cookies);

    if (!can(MANAGE_EVENTS)) {
      return redirect(
        307,
        `/${event.params.id}/`,
        { message: "You don't have permission to do that.", type: "error" },
        event.cookies,
      );
    }

    // combine the datetimes

    let startDate = form.data.startDate.split("T")[0];
    let startTime = String(form.data.startTime).padStart(4, "0");
    let startHour = startTime.slice(0, 2);
    let startMinute = startTime.slice(2);
    let start = `${startDate}T${startHour}:${startMinute}:00Z`;

    let endDate = form.data.endDate.split("T")[0];
    let endTime = String(form.data.endTime).padStart(4, "0");
    let endHour = endTime.slice(0, 2);
    let endMinute = endTime.slice(2);
    let end = `${endDate}T${endHour}:${endMinute}:00Z`;

    // generate the blurhash

    const imageData = await getPixels(form.data.bannerUrl);
    const data = Uint8ClampedArray.from(imageData.data);
    const blurhash = encode(data, imageData.width, imageData.height, 4, 4);

    await prisma.event.create({
      data: {
        id: ulid(),
        name: form.data.name,
        hostId: event.params.id,
        start: start,
        end: end,
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
    let { user, roles } = await loadUserData(event.cookies);

    if (!can(MANAGE_EVENTS)) {
      return redirect(
        307,
        `/${event.params.id}/`,
        { message: "You don't have permission to do that.", type: "error" },
        event.cookies,
      );
    }

    let data = await event.request.formData();

    if (!data.has("eventId") || !data.has("public")) {
      return { success: false };
    } else {
      let id = data.get("eventId")!.toString();
      let isPublic = data.get("public")!.toString() === "true";
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
