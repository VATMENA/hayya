import type { PageServerLoad, Actions } from "./$types";
import prisma from "$lib/prisma";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { fail } from "@sveltejs/kit";
import { loadUserData } from "$lib/auth";
import { ulid } from "ulid";

export const load: PageServerLoad = async ({ parent }) => {
  let { user } = await parent();
  if (!user.isSiteAdmin) {
    return {};
  }

  return {
    users: await prisma.userFacilityAssignment.findMany({
      where: {
        assignmentType: "DivisionalStaff",
      },
      include: {
        roles: true,
        user: true,
      },
    }),
    form: await superValidate(formSchema),
  };
};

export const actions: Actions = {
  create: async (event) => {
    let form = await superValidate(event, formSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    let { user } = await loadUserData(event.cookies, null);
    if (!user.isSiteAdmin) {
      return fail(400, { form });
    }

    await prisma.userFacilityAssignment.create({
      data: {
        id: ulid(),
        userId: form.data.cid,
        facilityId: form.data.facilityId,
        assignmentType: "DivisionalStaff",
      },
    });

    return {
      form,
    };
  },
  createAll: async (event) => {
    let form = await superValidate(event, formSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    let { user } = await loadUserData(event.cookies, null);
    if (!user.isSiteAdmin) {
      return fail(400, { form });
    }

    let facilities = await prisma.facility.findMany();

    for (let f of facilities) {
      if (f.dotnetType === "Subdivision") {
        await prisma.userFacilityAssignment.create({
          data: {
            id: ulid(),
            userId: form.data.cid.toString(),
            facilityId: f.id,
            assignmentType: "DivisionalStaff",
          },
        });
      }
    }

    return {
      form,
    };
  },
  delete: async (event) => {
    let { user } = await loadUserData(event.cookies, null);
    if (!user.isSiteAdmin) {
      return fail(400, {});
    }

    await prisma.userFacilityAssignment.delete({
      where: {
        id: (await event.request.formData()).get("id")!.toString(),
      },
    });
  },
};
