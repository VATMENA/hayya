<script lang="ts">
  import PlusIcon from "lucide-svelte/icons/plus";
  import { MessageSquareIcon, OrbitIcon } from "lucide-svelte";

  export let type: string;
</script>

<div class="mb-2 flex space-x-2">
  <span class="h-8 w-8 rounded-full bg-muted p-2">
    {#if type === "createCase"}
      <PlusIcon class="h-4 w-4" />
    {:else if type === "comment"}
      <MessageSquareIcon class="h-4 w-4" />
    {:else if type === "stateChange"}
      <OrbitIcon class="h-4 w-4" />
    {/if}
  </span>
  <span class="mt-1">
    <slot name="header" />
  </span>
</div>

<div class="mb-2 ml-10">
  <slot name="content" />
</div>
