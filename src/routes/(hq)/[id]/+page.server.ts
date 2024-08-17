import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({ parent }) => {
  let { user } = await parent();

  return {
    certs: await prisma.certificate.findMany({
      where: {
        holderId: user.id,
      },
      include: {
        instructor: true,
      },
    }),
  };
};
