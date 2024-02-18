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
import type {Config} from "@sveltejs/adapter-vercel";

export const config: Config = {
  maxDuration: 300
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
  default: async (event) => {
    const form = await superValidate(event, formSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    let { user, roles } = await loadUserData(event.cookies);

    if (
      !can(
        roles,
        event.params.id,
        user.vaccId,
        `vacc.${event.params.id}.events.manage`,
      )
    ) {
      return redirect(
        307,
        `/dashboard/vaccs/${event.params.id}/`,
        { message: "You don't have permission to do that.", type: "error" },
        event.cookies,
      );
    }

    // generate the blurhash

    const imageData = await getPixels(form.data.bannerUrl);
    const data = Uint8ClampedArray.from(imageData.data);
    const blurhash = encode(data, imageData.width, imageData.height, 4, 4);

    // combine the datetimes
    let startDate = new Date(form.data.startDate);
    let start_hour = parseInt(
      String(form.data.startTime).padStart(4, "0").slice(0, 2),
    );
    let start_minute = parseInt(
      String(form.data.startTime).padStart(4, "0").slice(2),
    );
    startDate.setHours(start_hour, start_minute);

    let endDate = new Date(form.data.endDate);
    let end_hour = parseInt(
      String(form.data.endTime).padStart(4, "0").slice(0, 2),
    );
    let end_minute = parseInt(
      String(form.data.endTime).padStart(4, "0").slice(2),
    );
    endDate.setHours(end_hour, end_minute);

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
};
