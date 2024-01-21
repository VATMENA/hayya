import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  cookies.delete("hq_token", { path: "/" });
  redirect(301, "/");
};
