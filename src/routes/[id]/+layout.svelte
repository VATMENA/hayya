<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import { setContext } from "svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  setContext("roles", data.roles);
</script>

<Nav />
<div
  class="flex flex-col h-full overflow-auto w-full bg-background shadow-lg space-y-4 p-8 pt-6 rounded-md">
  <slot />
</div>
