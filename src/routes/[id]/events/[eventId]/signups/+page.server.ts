import { loadUserData } from '$lib/auth';
import { can } from '$lib/perms/can';
import { MANAGE_EVENTS } from '$lib/perms/permissions';
import prisma from '$lib/prisma';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
    await loadUserData(cookies, null);

    if (!can(MANAGE_EVENTS)) {
        redirect(307, `/${params.id}/events/${params.eventId}`, {
            type: "error",
            message: "You do not have permission to do this"
        }, cookies);
      }

    const event = await prisma.event.findUnique({
        where: {
            id: params.eventId,
        },
        include: {
            signups: {
                include: {
                    user: {
                        include: {
                            heldCertificates: true,
                        },
                    },
                },
            },
        },
    });

    return {
        event,
    };
}