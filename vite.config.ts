import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  optimizeDeps: {
    include: [
      "tailwind-variants",
      "clsx",
      "tailwind-merge",
      "@internationalized/date",
      "mode-watcher",
      "svelte-sonner",
      "sveltekit-flash-message",
      "bits-ui",
      "lucide-svelte",
      "minimatch",
      "zod",
      "formsnap",
      "sveltekit-superforms/client",
      "jsonwebtoken",
      "@prisma/client",
      "marked",
      "@unpic/placeholder"
    ],
  },
});
