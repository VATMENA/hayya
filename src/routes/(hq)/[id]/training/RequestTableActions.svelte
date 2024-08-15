<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { toast } from "svelte-sonner";
  import { invalidateAll } from "$app/navigation";

  export let id: string;

  let deleteOpen = false;

  async function cancel() {
    let data = new URLSearchParams();
    data.set("id", id);
    await fetch("?/cancelRequest", {
      method: 'POST',
      body: data.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    });
    deleteOpen = false;
    await invalidateAll();
    toast.success("Request cancelled successfully!");
  }
</script>

<Dialog.Root bind:open={deleteOpen}>
  <Dialog.Trigger class={buttonVariants()}>Cancel Request</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you sure?</Dialog.Title>
      <Dialog.Description>
        This will immediately remove your training request. New requests will be moved to the back of the queue.
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button on:click={() => {deleteOpen = false;}} variant="outline">Nevermind</Button>
      <Button on:click={cancel} variant="destructive">Yes, cancel it</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>