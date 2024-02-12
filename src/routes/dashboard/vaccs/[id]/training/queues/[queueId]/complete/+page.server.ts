import type { PageServerLoad, Actions } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { fail } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import type { TrainingQueue } from "@prisma/client";
import { ulid } from "ulid";
import { verifyToken } from "$lib/auth";
import { getUserRoles } from "$lib/perms/getUserRoles";
import { can } from "$lib/perms/can";

export const load: PageServerLoad = async ({ params }) => {
  let queue = await prisma.trainingQueue.findUnique({
    where: {
      id: params.queueId,
      vaccId: params.id,
    },
  });
  let form = await superValidate(formSchema);
  return {
    form,
    queue,
  };
};

export const actions: Actions = {
  default: async (event) => {
    if (!event.cookies.get("hq_token")) {
      redirect(
        301,
        "/",
        { type: "error", message: "You need to be logged in for that" },
        event,
      );
    }
    let token = event.cookies.get("hq_token")!;
    let maybe_cid = verifyToken(token);
    if (maybe_cid === null) {
      redirect(
        301,
        "/",
        { type: "error", message: "You need to be logged in for that" },
        event,
      );
    }
    let user = await prisma.user.findUnique({
      where: {
        id: maybe_cid!,
      },
    })!;
    let roles = await getUserRoles(user!.id);

    if (
      !can(
        roles!,
        event.params.id,
        user!.vaccId,
        `vacc.${event.params.id}.training.queues.recommend`,
      )
    ) {
      redirect(
        301,
        `/dashboard/vaccs/${event.params.id}`,
        { type: "error", message: "You don't have permission to do that." },
        event,
      );
    }

    const form = await superValidate(event, formSchema);
    if (!form.valid) {
      return fail(400, { form });
    }

    await prisma.user.update({
      where: {
        id: form.data.cid,
      },
      data: {
        completedTrainingQueues: {
          push: event.params.queueId,
        },
      },
    });

    redirect(
      307,
      `/dashboard/vaccs/${event.params.id}/training/queues/manage`,
      { type: "success", message: "Marked user as complete!" },
      event,
    );
  },
};
