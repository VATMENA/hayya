import { redirect } from "sveltekit-flash-message/server";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  cookies.delete("hq_token", { path: "/" });
  redirect(
    301,
    "/",
    { type: "success", message: "Logged out successfully." },
    cookies,
  );
};
