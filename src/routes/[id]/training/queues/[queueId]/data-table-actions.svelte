<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import { MoreHorizontal } from "lucide-svelte";
  import { page } from "$app/stores";
  import { toast } from "svelte-sonner";
  import { goto, invalidate } from "$app/navigation";
  import { can } from "$lib/perms/can";
  import { MANAGE_QUEUES } from "$lib/perms/permissions";

  export let id: string;

  const removeUser = async (id: string) => {
    await goto(
      `/${$page.params.id}/training/queues/${$page.params.queueId}/remove/${id}`,
    );

    invalidate("queue:data");
  };
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
          navigator.clipboard.writeText(id);
          toast.success("CID copied to clipboard!");
        }}>
        Copy CID
      </DropdownMenu.Item>
    </DropdownMenu.Group>

    <DropdownMenu.Separator />

    {#if can(MANAGE_QUEUES)}
      <DropdownMenu.Group>
        <DropdownMenu.Item on:click={() => removeUser(id)}>
          Remove from list
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>
