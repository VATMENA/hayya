import type { PageServerLoad, Actions } from "./$types";
import prisma from "$lib/prisma";
import { can } from "$lib/perms/can";
import { MANAGE_TV_REQUESTS } from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";
import { loadUserData } from "$lib/auth";
import { ulid } from "ulid";
import { TVCaseState, TVCaseType } from "@prisma/client";

export const load: PageServerLoad = async ({ parent, cookies, params }) => {
  let { user } = await parent();

  let id = Number.parseInt(params.caseId);
  if (!id || isNaN(id)) {
    return {};
  }

  let tvCase = await prisma.tVCase.findUnique({
    where: {
      id: id,
      facilityId: params.id,
    },
    include: {
      comments: {
        include: {
          user: true,
        },
      },
      stateChanges: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!tvCase || (!can(MANAGE_TV_REQUESTS) && user.id !== tvCase.userId)) {
    return redirect(
      301,
      `/${params.id}`,
      { type: "error", message: "You don't have permission to view that." },
      cookies,
    );
  }

  let events = [];

  events.push({
    type: "createCase",
    user: user.name,
    time: tvCase.createdAt,
    data: null,
  });

  for (let comment of tvCase.comments) {
    events.push({
      type: "comment",
      user: comment.user.name,
      time: comment.createdAt,
      data: {
        id: comment.id,
        content: comment.content,
      },
    });
  }
  for (let stateChange of tvCase.stateChanges) {
    events.push({
      type: "stateChange",
      user: stateChange.user.name,
      time: stateChange.createdAt,
      data: {
        from: stateChange.before,
        to: stateChange.after,
      },
    });
  }

  events.sort((a, b) => {
    if (a.time < b.time) {
      return -1;
    } else if (a.time > b.time) {
      return 1;
    } else {
      return 0;
    }
  });

  return {
    tvCase,
    events,
  };
};

export const actions: Actions = {
  addComment: async (event) => {
    let { user } = await loadUserData(event.cookies, event.params.id);

    let tvCase = await prisma.tVCase.findUnique({
      where: {
        id: Number.parseInt(event.params.caseId),
      },
    });

    if (!tvCase) {
      redirect(
        307,
        "/tvc",
        {
          type: "error",
          message:
            "That case does not exist or you do not have permission to view it.",
        },
        event.cookies,
      );
    }

    if (!can(MANAGE_TV_REQUESTS) && tvCase.userId !== user.id) {
      redirect(
        307,
        "/tvc",
        {
          type: "error",
          message:
            "That case does not exist or you do not have permission to view it.",
        },
        event.cookies,
      );
    }

    if (tvCase.caseState === "Rejected" || tvCase.caseState === "Accepted") {
      redirect(
        307,
        event.url,
        { type: "error", message: "You can't comment on a closed case." },
        event.cookies,
      );
    }

    let data = await event.request.formData();

    await prisma.tVCaseComment.create({
      data: {
        id: ulid(),
        userId: user.id,
        caseId: tvCase.id,
        content: data.get("comment")!.toString(),
      },
    })!;
  },
  setStatus: async (event) => {
    let { user } = await loadUserData(event.cookies, event.params.id);

    let tvCase = await prisma.tVCase.findUnique({
      where: {
        id: Number.parseInt(event.params.caseId),
      },
    });

    if (!tvCase) {
      redirect(
        307,
        "/tvc",
        {
          type: "error",
          message:
            "That case does not exist or you do not have permission to view it.",
        },
        event.cookies,
      );
    }

    if (!can(MANAGE_TV_REQUESTS)) {
      redirect(
        307,
        "/tvc",
        {
          type: "error",
          message:
            "That case does not exist or you do not have permission to view it.",
        },
        event.cookies,
      );
    }

    let data = await event.request.formData();

    let subStatus = data.get("to")!.toString();
    let status;
    if (subStatus === "accept") {
      status = TVCaseState.Accepted;
    } else if (subStatus === "reject") {
      status = TVCaseState.Rejected;
    } else if (subStatus === "infoNeeded") {
      status = TVCaseState.AdditionalInformationNeeded;
    } else if (subStatus === "inReview") {
      status = TVCaseState.InReview;
    } else {
      status = TVCaseState.Pending;
    }

    await prisma.tVCase.update({
      where: {
        id: tvCase.id,
      },
      data: {
        caseState: status,
      },
    });

    await prisma.tVCaseStateChange.create({
      data: {
        id: ulid(),
        userId: user.id,
        caseId: tvCase.id,
        before: tvCase.caseState,
        after: status,
      },
    });

    if (
      status === TVCaseState.Accepted &&
      tvCase.caseType === TVCaseType.Visit
    ) {
      // create the assignment
      await prisma.userFacilityAssignment.create({
        data: {
          id: ulid(),
          userId: user.id,
          facilityId: tvCase.facilityId,
          caseId: tvCase.id,
          assignmentType: "Secondary",
        },
      });
    }
  },
};
