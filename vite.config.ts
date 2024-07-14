import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      adapter: "other",
      sourceMapsUploadOptions: {
        org: "vatmena",
        project: "hayya",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
    sveltekit(),
  ],
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
  assetsInclude: ["**/*.md", "**/*.mdx"],
  resolve: {
    alias: [
      {
        find: "contentlayer/generated",
        replacement: fileURLToPath(
          new URL("./.contentlayer/generated", import.meta.url),
        ),
      },
    ],
  },
});
