import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";
import { can } from "$lib/perms/can";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "$lib/components/resources_page/schema";
import { handleResourceSubmit } from "$lib/components/resources_page/action";
import type { Actions } from "@sveltejs/kit";
import { VIEW_PRIVATE_RESOURCES } from "$lib/perms/permissions";

export const load: PageServerLoad = async ({ params, parent }) => {
if (can(VIEW_PRIVATE_RESOURCES)) {
    return {
      resources: await prisma.resource.findMany({
        where: {
          facilityId: params.id,
        },
      }),
      form: await superValidate(formSchema),
    };
  } else {
    return {
      resources: await prisma.resource.findMany({
        where: {
          facilityId: params.id,
          isStaffOnly: false,
        },
      }),
      form: await superValidate(formSchema),
    };
  }
};

export const actions: Actions = {
  create: (e) => handleResourceSubmit(e, e.params.id!),
};
