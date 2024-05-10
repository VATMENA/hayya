import prisma from "$lib/prisma";
import { superValidate } from "sveltekit-superforms/server";
import type { PageServerLoad } from "./$types";
import { formSchema } from "./add-form";
import type { Actions } from "@sveltejs/kit";
import { can } from "$lib/perms/can";
import { MANAGE_QUEUES } from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({ params, depends }) => {
  depends("queue:data");

  const queue = await prisma.trainingQueue.findUnique({
    where: {
      id: params.queueId,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  return {
    queue,
    form: await superValidate(zod(formSchema)),
  };
};

export const actions: Actions = {
  addStudent: async (event) => {
    const form = await superValidate(event, zod(formSchema));

    if (!can(MANAGE_QUEUES)) {
      redirect(
        307,
        event.url.pathname,
        {
          type: "error",
          message: "You do not have permission to do that",
        },
        event.cookies,
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: {
        id: form.data.id,
      },
    });

    if (!targetUser) {
      redirect(
        307,
        event.url.pathname,
        {
          type: "error",
          message: "This user is not registered on Hayya",
        },
        event.cookies,
      );
    }

    if (event.params.queueId) {
      try {
        await prisma.trainingQueueMembership.create({
          data: {
            queueId: event.params.queueId,
            userId: form.data.id,
            joinedAt: new Date(),
          },
        });
      } catch (e) {
        redirect(
          307,
          event.url.pathname,
          {
            type: "error",
            message: "Student is already a member of this queue",
          },
          event.cookies,
        );
      }
    }

    return {
      form,
    };
  },
};
