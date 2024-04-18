import type {PageServerLoad} from "./$types";
import prisma from "$lib/prisma";
import { can } from "$lib/perms/can";
import { MANAGE_TV_REQUESTS } from "$lib/perms/permissions";
import { redirect } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async ({parent, cookies, params}) => {
  let { user } = await parent();

  let tvCase = await prisma.tVCase.findUnique({
    where: {
      id: Number.parseInt(params.caseId),
      facilityId: params.id
    },
    include: {
      comments: {
        include: {
          user: true
        }
      },
      stateChanges: {
        include: {
          user: true
        }
      }
    }
  });

  console.log(tvCase);

  if (!tvCase || (!can(MANAGE_TV_REQUESTS) && user.id !== tvCase.userId)) {
    return redirect(301, `/${params.id}`, {'type': 'error', 'message': 'You don\'t have permission to view that.'}, cookies);
  }

  let events = [];

  events.push({
    'type': 'createCase',
    'user': user.name,
    'time': tvCase.createdAt,
    'data': null
  });

  for (let comment of tvCase.comments) {
    events.push({
      'type': 'comment',
      'user': comment.user.name,
      'time': comment.createdAt,
      'data': {
        'id': comment.id,
        'content': comment.content
      }
    });
  }
  for (let stateChange of tvCase.stateChanges) {
    events.push({
      'type': 'stateChange',
      'user': stateChange.user.name,
      'time': stateChange.createdAt,
      'data': {
        'from': stateChange.before,
        'to': stateChange.after
      }
    });
  }

  events.sort(
    (a, b) => {
      if (a.time < b.time) {
        return -1;
      } else if (a.time > b.time) {
        return 1;
      } else {
        return 0;
      }
    }
  );

  return {
    tvCase,
    events
  }
}