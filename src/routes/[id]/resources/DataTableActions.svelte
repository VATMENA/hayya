<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import { Button } from "$lib/components/ui/button";
  // @formatter:off
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Dialog from "$lib/components/ui/dialog";
  // @formatter:on
  import type { Resource } from "@prisma/client";
  import { toast } from "svelte-sonner";
  import { invalidateAll } from "$app/navigation";

  export let data: Resource;

  let dropdownOpen = false;
  let dialogOpen = false;

  async function deleteResource() {
    let rdata = new URLSearchParams();
    rdata.set("id", data.id);
    await fetch("?/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: rdata.toString(),
    });
    toast.success("Resource removed successfully!");
    dialogOpen = false;
    await invalidateAll();
  }
</script>

<DropdownMenu.Root bind:open={dropdownOpen}>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      variant="ghost"
      builders={[builder]}
      size="icon"
      class="relative h-8 w-8 p-0">
      <span class="sr-only">Open menu</span>
      <Ellipsis class="h-4 w-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Item
        on:click={() => {
          navigator.clipboard.writeText(data.id);
          toast.success("Resource ID copied to clipboard!");
        }}>
        Copy resource ID
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item href={data.link}>View resource</DropdownMenu.Item>
    <DropdownMenu.Item
      on:click={() => {
        dropdownOpen = false;
        dialogOpen = true;
      }}
      class="text-red-500 data-[highlighted]:bg-red-500/30 data-[highlighted]:text-red-500">
      Delete resource
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you sure?</Dialog.Title>
      <Dialog.Description>
        Are you sure you want to permanently delete the resource <b>
          {data.name}
        </b>
        ?
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid grid-cols-2 gap-4">
      <Button
        on:click={() => {
          dialogOpen = false;
        }}>
        Nevermind
      </Button>
      <Button on:click={deleteResource} variant="destructive">I'm sure</Button>
    </div>
  </Dialog.Content>
</Dialog.Root>
