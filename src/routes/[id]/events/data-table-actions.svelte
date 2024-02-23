<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import type { Event } from "@prisma/client";
  import { MoreHorizontal } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";

  export let event: Event;
  export let canManageEvents: boolean;
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      variant="ghost"
      builders={[builder]}
      size="icon"
      class="relative w-8 h-8 p-0">
      <span class="sr-only">Open menu</span>
      <MoreHorizontal class="w-4 h-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Item
        on:click={() => {
          navigator.clipboard.writeText(event.id);
          toast.success("Event ID copied to clipboard");
        }}>
        Copy ID
      </DropdownMenu.Item>
      {#if canManageEvents}
        <DropdownMenu.Separator />
        {#if event.public}
          <DropdownMenu.Item>Make Private</DropdownMenu.Item>
        {:else}
          <DropdownMenu.Item>Make Public</DropdownMenu.Item>
        {/if}
        <DropdownMenu.Item>Edit</DropdownMenu.Item>
        <DropdownMenu.Item
          class="text-red-500 data-[highlighted]:bg-red-500/30 data-[highlighted]:text-red-500">
          Delete
        </DropdownMenu.Item>
      {/if}
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
