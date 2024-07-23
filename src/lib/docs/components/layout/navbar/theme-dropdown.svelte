<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { setMode } from "mode-watcher";
  import { MoonStarIcon } from "lucide-svelte";
  const modes = ["light", "dark", "system"] as const;
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger
    aria-label="Change theme"
    class={buttonVariants({ variant: "ghost", size: "icon" })}>
    <MoonStarIcon class="size-6" />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="z-[100]">
    {#each modes as themeMode}
      <DropdownMenu.Item on:click={() => setMode(themeMode)} class="capitalize">
        {themeMode}
      </DropdownMenu.Item>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
