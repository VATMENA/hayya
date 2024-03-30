import type { PageServerLoad, Actions } from "./$types";
import prisma from "$lib/prisma";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { fail } from "@sveltejs/kit";
import { loadUserData } from "$lib/auth";

export const load: PageServerLoad = async ({ parent }) => {
  const { user } = await parent();
  if (!user.isSiteAdmin) {
    return {};
  }

  return {
    facilities: await prisma.facility.findMany()!,
    form: await superValidate(formSchema),
  };
};

export const actions: Actions = {
  create: async (event) => {
    const form = await superValidate(event, formSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const { user } = await loadUserData(event.cookies, null);
    if (!user.isSiteAdmin) {
      return fail(400, { form });
    }

    await prisma.facility.create({
      data: {
        id: form.data.id.toString(),
        name: form.data.name.toString(),
        dotnetId: form.data.dotnetId.toString(),
        dotnetType:
          form.data.dotnetType.toString() === "Division"
            ? "Division"
            : "Subdivision",
        contactEmail: "todo@vatsim.me",
        website: "https://vatsim.me",
      },
    });

    return {
      form,
    };
  },
  delete: async (event) => {
    const { user } = await loadUserData(event.cookies, null);
    if (!user.isSiteAdmin) {
      return fail(400, {});
    }
    await prisma.facility.delete({
      where: {
        id: (await event.request.formData()).get("id")!.toString(),
      },
    });
  },
};
