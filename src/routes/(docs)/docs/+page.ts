import type { PageLoad } from "./$types";
import { getDoc } from "$lib/docs/utils/docs";

export const load: PageLoad = async () => {
  const { component, title, metadata } = await getDoc("index");
  return {
    component,
    title,
    metadata,
  };
};
