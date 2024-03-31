import type { PageServerLoad, Actions } from "./$types";
import { loadUserData } from "$lib/auth";
import { can } from "$lib/perms/can";
import {
  DELETE_REQUEST,
  SELF_ASSIGN_TO_REQUEST,
  TRAIN,
} from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./assign";
import { fail } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({ cookies, params }) => {
  await loadUserData(cookies, params.id);

  if (!can(TRAIN)) {
    redirect(
      307,
      `/${params.id}/training`,
      { type: "error", message: "You don't have permission to do that." },
      cookies,
    );
  }

  const unassigned = await prisma.trainingRequest.findMany({
    where: {
      facilityId: params.id,
      endDate: {
        gt: new Date(),
      },
      instructorId: null,
    },
    include: {
      student: true,
      instructor: true,
    },
  });
  const expired = await prisma.trainingRequest.findMany({
    where: {
      facilityId: params.id,
      endDate: {
        lt: new Date(),
      },
    },
    include: {
      student: true,
      instructor: true,
    },
  });
  const assigned = await prisma.trainingRequest.findMany({
    where: {
      facilityId: params.id,
      endDate: {
        gt: new Date(),
      },
      NOT: {
        instructorId: null,
      },
    },
    include: {
      student: true,
      instructor: true,
    },
  });

  return {
    unassigned,
    assigned,
    expired,
    form: await superValidate(zod(formSchema)),
  };
};

export const actions: Actions = {
  deleteRequest: async (event) => {
    await loadUserData(event.cookies, event.params.id);

    if (!can(DELETE_REQUEST)) {
      redirect(
        307,
        `/${event.params.id}/training`,
        { type: "error", message: "You don't have permission to do that." },
        event.cookies,
      );
    }

    await prisma.trainingRequest.delete({
      where: {
        id: (await event.request.formData()).get("id")?.toString() || "",
      },
    });
  },
  selfAssign: async (event) => {
    const { user } = await loadUserData(event.cookies, event.params.id);

    if (!can(SELF_ASSIGN_TO_REQUEST)) {
      redirect(
        307,
        `/${event.params.id}/training`,
        { type: "error", message: "You don't have permission to do that." },
        event.cookies,
      );
    }

    const form = await superValidate(event, zod(formSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const existingModel = await prisma.trainingRequest.findUnique({
      where: {
        id: form.data.requestId,
      },
    });

    if (!existingModel) {
      redirect(
        307,
        `/${event.params.id}/training`,
        { type: "error", message: "That request doesn't exist." },
        event.cookies,
      );
    }

    if (existingModel.facilityId != event.params.id) {
      redirect(
        307,
        `/${event.params.id}/training`,
        { type: "error", message: "You don't have permission to do that." },
        event.cookies,
      );
    }

    await prisma.trainingRequest.update({
      where: {
        id: form.data.requestId,
      },
      data: {
        instructorId: user.id,
      },
    });

    return {
      form,
    };
  },
  assign: async (event) => {
    const { user } = await loadUserData(event.cookies, event.params.id);

    if (!can(SELF_ASSIGN_TO_REQUEST)) {
      redirect(
        307,
        `/${event.params.id}/training`,
        { type: "error", message: "You don't have permission to do that." },
        event.cookies,
      );
    }

    const form = await superValidate(event, zod(formSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const existingModel = await prisma.trainingRequest.findUnique({
      where: {
        id: form.data.requestId,
      },
    });

    if (!existingModel) {
      redirect(
        307,
        `/${event.params.id}/training`,
        { type: "error", message: "That request doesn't exist." },
        event.cookies,
      );
    }

    if (existingModel.facilityId != event.params.id) {
      redirect(
        307,
        `/${event.params.id}/training`,
        { type: "error", message: "You don't have permission to do that." },
        event.cookies,
      );
    }

    await prisma.trainingRequest.update({
      where: {
        id: form.data.requestId,
      },
      data: {
        instructorId: form.data.instructorId,
      },
    });

    return {
      form,
    };
  },
};
