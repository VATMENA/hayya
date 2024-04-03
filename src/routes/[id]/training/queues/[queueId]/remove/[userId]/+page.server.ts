import prisma from '$lib/prisma';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';
import { can } from '$lib/perms/can';
import { MANAGE_QUEUES } from '$lib/perms/permissions';

export const load: PageServerLoad = async ({ params, cookies }) => {
    if (can(MANAGE_QUEUES)) {
        redirect(307, `/${params.id}/training/queues/${params.queueId}`, {
            type: "error",
            message: "You do not have permission to do that",
        }, cookies)
    }

    await prisma.trainingQueueMembership.deleteMany({
        where: {
            userId: params.userId,
            queueId: params.queueId,
        }
    });

    redirect(
        301,
        `/${params.id}/training/queues/${params.queueId}`,
        { type: "success", message: "Removed user from queue successfully" },
        cookies
    );
}