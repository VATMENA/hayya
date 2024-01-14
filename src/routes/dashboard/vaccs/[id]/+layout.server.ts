import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params }) => {
  return {
    nav_title: params.id, // TODO: Load the vACC name here (i.e. Arabian vACC instead of ARB)
    nav_vacc: true,
    vacc_id: params.id,
  };
};
