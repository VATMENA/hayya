<script lang="ts">
  import "../app.pcss";
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner";
  import { toast } from "svelte-sonner";
  import { getFlash } from "sveltekit-flash-message";
  import { page } from "$app/stores";
  import { browser, version } from "$app/environment";
  import { onMount } from "svelte";

  interface Flash {
    type: "success" | "info" | "warning" | "error";
    message: string;
  }

  let flash = undefined;
  if (browser) {
    flash = getFlash(page);
  }

  $: if ($flash) {
    // @ts-ignore
    if ($flash.type === "success") {
      // @ts-ignore
      toast.success($flash.message);
      // @ts-ignore
    } else if ($flash.type === "info") {
      // @ts-ignore
      toast.info($flash.message);
      // @ts-ignore
    } else if ($flash.type === "warning") {
      // @ts-ignore
      toast.info($flash.message);
      // @ts-ignore
    } else if ($flash.type === "error") {
      // @ts-ignore
      toast.error($flash.message);
    }

    // Clear the flash message to avoid double-toasting.
    $flash = undefined;
  }
</script>

<!-- Dark mode -->
<ModeWatcher />
<Toaster richColors />

<slot />
