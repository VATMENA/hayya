import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({parent}) => {
  let { user } = await parent();

  // get the user's training plan registration, if they have one
  let activePlan = await prisma.trainingPlanRegistration.findFirst({
    where: {
      userId: user.id
    }
  });
  // get the user's training plan registration request, if they have one
  let activePlanRequest = await prisma.trainingPlanRegistrationRequest.findFirst({
    where: {
      userId: user.id
    }
  });

  return {
    activePlan,
    activePlanRequest
  }
}