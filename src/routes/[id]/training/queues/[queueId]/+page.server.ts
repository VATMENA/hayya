import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, depends }) => {
    depends("queue:data");

    console.log("Running load function...");

    let queue = await prisma.trainingQueue.findUnique({
        where: {
            id: params.queueId,
        },
        include: {
            members: {
                include: {
                    user: true,
                }
            }
        }
    });

    return {
        queue,
    };
}