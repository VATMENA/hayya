import type { PageServerLoad, Actions } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import prisma from "$lib/prisma";
import { fail } from "@sveltejs/kit";
import { loadUserData } from "$lib/auth";
import { ulid } from "ulid";
import { redirect } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(formSchema)),
    facilities: await prisma.facility.findMany({})!,
  };
};

export const actions: Actions = {
  default: async (event) => {
    let form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    let { user } = await loadUserData(event.cookies, null);

    let newCase = await prisma.tVCase.create({
      data: {
        userId: user.id,
        facilityId: form.data.facilityId,
        caseType: "Visit",
        caseState: "Pending",
      },
    })!;
    let topComment = await prisma.tVCaseComment.create({
      data: {
        id: ulid(),
        userId: user.id,
        caseId: newCase.id,
        content: `**Why do you want to visit?**\n\n${form.data.why}\n\n**What controlling positions interest you within the facility?**\n\n${form.data.whatPositions}\n\n**Do you have any relevant experience, on or off network, that you think may affect the outcome of your application?**\n\n${form.data.experience}\n\n**Do you have anything else to add?**\n\n${form.data.anythingElse}`,
      },
    })!;

    redirect(
      307,
      `/${form.data.facilityId}/tvc/cases/${newCase.id}`,
      {
        type: "success",
        message:
          "Your new application has been submitted successfully. Please allow up to 2 weeks for it to be processed, as all applications are manually reviewed!",
      },
      event.cookies,
    );
  },
};
