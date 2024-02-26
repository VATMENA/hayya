<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import { Copy, MoreHorizontal } from "lucide-svelte";
  import { page } from "$app/stores";
  import { can } from "$lib/perms/can";
  import { MANAGE_QUEUES, RECOMMEND_FOR_QUEUE } from "$lib/perms/permissions";
  import { toast } from "svelte-sonner";

  export let id: string;
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
      <DropdownMenu.Item on:click={() => {navigator.clipboard.writeText(id); toast.success("Queue ID copied to clipboard!");}}>
        Copy ID
      </DropdownMenu.Item>
    </DropdownMenu.Group>


    {#if can(RECOMMEND_FOR_QUEUE)}
      <DropdownMenu.Separator />

      <DropdownMenu.Group>
        <DropdownMenu.Item
          href="/{$page.params.id}/training/queues/{id}/recommend">
          Recommend Student
        </DropdownMenu.Item>
        <DropdownMenu.Item
          href="/{$page.params.id}/training/queues/{id}/complete">
          Mark Student Complete
        </DropdownMenu.Item>
      </DropdownMenu.Group>


    {/if}

    {#if can(MANAGE_QUEUES)}
      <DropdownMenu.Separator />

      <DropdownMenu.Group>
        <DropdownMenu.Item href="/{$page.params.id}/training/queues/{id}/edit/">
          Edit details
        </DropdownMenu.Item>
        <DropdownMenu.Item
          href="/{$page.params.id}/training/queues/{id}/delete/"
          class="text-red-500 data-[highlighted]:bg-red-500/30 data-[highlighted]:text-red-500">
          Delete queue
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>
