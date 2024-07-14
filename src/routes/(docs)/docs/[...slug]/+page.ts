import type { PageLoad } from "./$types";
import { getDoc } from "$lib/docs/utils/docs";

export const load: PageLoad = async (event) => {
  const { component, title, metadata } = await getDoc(event.params.slug);

  return {
    component,
    title,
    description: metadata.description,
    metadata,
    // @ts-expect-error it's fine
    ...event.data,
  };
};
