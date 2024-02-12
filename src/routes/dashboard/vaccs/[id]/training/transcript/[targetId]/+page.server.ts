import type { PageServerLoad } from "./$types";
import {can} from "$lib/perms/can";
import prisma from "$lib/prisma";
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async ({ parent, params }) => {
    const { user, roles } = await parent();

    let targetUser = await prisma.user.findUnique({
        where: {
            id: params.targetId
        }
    });

    if (targetUser === null) {
        redirect(301, `/dashboard/vaccs/${params.id}/training`);
    }

    let isMentor = can(roles!, targetUser.vaccId, user.vaccId, `vacc.${targetUser.vaccId}.training.train`);

    if (!(user.id == params.targetId || isMentor)) {
        redirect(301, `/dashboard/vaccs/${params.id}/training`);
    }

    // get all the user's sessions
    let sessions = await prisma.session.findMany({
        where: {
            studentId: targetUser.id
        },
        include: {
            instructor: true
        }
    })!;

    if (!isMentor) {
        for (let session of sessions) {
            session.instructorComments = "[unavailable]"; // Data is just passed as json, so hidden data must be hidden at the server level
        }
    }

    return {
        sessions,
        targetUser,
        isMentor
    }
}