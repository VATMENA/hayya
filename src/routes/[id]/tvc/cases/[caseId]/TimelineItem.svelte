<script lang="ts">
  import PlusIcon from "lucide-svelte/icons/plus";
  import { MessageSquareIcon, OrbitIcon } from "lucide-svelte";

  export let type: string;
</script>

<div class="flex space-x-2 mb-2">
  <span class="bg-muted rounded-full p-2 w-8 h-8">
    {#if type === "createCase"}
      <PlusIcon class="w-4 h-4" />
    {:else if type === "comment"}
      <MessageSquareIcon class="w-4 h-4" />
    {:else if type === "stateChange"}
      <OrbitIcon class="w-4 h-4" />
    {/if}
  </span>
  <span class="mt-1">
    <slot name="header"></slot>
  </span>
</div>

<div class="ml-10 mb-2">
  <slot name="content"></slot>
</div>