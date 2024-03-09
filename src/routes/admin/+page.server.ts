import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async () => {
  return {
    totalUsers: await prisma.user.count(),
    totalFacilities: await prisma.facility.count(),
    divisionStaffAuthorizations: await prisma.userFacilityAssignment.count({
      where: {
        assignmentType: "DivisionalStaff",
      },
    }),
    siteAdministrators: await prisma.user.count({
      where: {
        isSiteAdmin: true,
      },
    }),
    connections: await prisma.connection.count({
      where: {
        endTime: null,
      },
    }),
  };
};
