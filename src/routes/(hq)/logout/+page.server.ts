import { redirect } from "sveltekit-flash-message/server";
import type { Actions } from "./$types";

export const actions = {
  default: async ({ cookies }) => {
    cookies.delete("hq_token", { path: "/" });
    redirect(
      307,
      "/",
      { type: "success", message: "Logged out successfully." },
      cookies,
    );
  },
} satisfies Actions;
