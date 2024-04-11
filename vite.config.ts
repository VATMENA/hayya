import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sentrySvelteKit({
    sourceMapsUploadOptions: {
      org: "vatmena",
      project: "javascript-sveltekit"
    }
  }), sveltekit()],
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
      "jsonwebtoken",
      "@prisma/client",
      "marked",
      "@unpic/placeholder",
      "svelte-headless-table/plugins",
      "tailwindcss/colors",
      "svelte-headless-table",
      "sveltekit-superforms/server",
      "sveltekit-superforms/client",
      "ulid",
    ],
  },
});