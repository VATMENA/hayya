<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import type { LayoutData } from "./$types";
  import { onMount } from "svelte";

  export let data: LayoutData;

  onMount(() => {
    if (!data.loggedin) {
      window.location.href = "/";
    }
  });
</script>

<Nav />
<div
  class="flex flex-col h-full overflow-auto w-full bg-background shadow-lg space-y-4 p-8 pt-6 rounded-md">
  <slot />
</div>
