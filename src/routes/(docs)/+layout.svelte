<script lang="ts">
  import { Navbar } from "$lib/docs/components/layout/navbar";
  import { ModeWatcher } from "mode-watcher";
  import { Footer } from "$lib/docs/components/layout";
  import Metadata from "$lib/docs/components/Metadata.svelte";
</script>

<Metadata />
<Navbar />
<div class="flex min-h-[calc(100vh-4rem)] flex-col">
  <div class="flex-grow">
    <slot />
  </div>
  <Footer />
</div>
