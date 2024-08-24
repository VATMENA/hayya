import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({ parent }) => {
  const { user } = await parent();
  if (!user.isSiteAdmin) {
    return {
      connections: [],
    };
  }

  return {
    connections: await prisma.connection.findMany({
      where: {
        endTime: null,
      },
      include: {
        user: true,
      },
    }),
  };
};
