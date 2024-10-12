<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { CheckIcon, XIcon } from "lucide-svelte";
  import { invalidateAll } from "$app/navigation";
  import { toast } from "svelte-sonner";

  export let id: string;

  let removeOpen = false;
  async function remove() {
    let data = new URLSearchParams();
    data.set("id", id);
    await fetch("?/remove", {
      method: "POST",
      body: data.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: document.cookie,
      },
    });
    await invalidateAll();
    removeOpen = false;
    toast.success("User enrollment cancelled successfully!");
  }
</script>

<Dialog.Root bind:open={removeOpen}>
  <Dialog.Trigger class={buttonVariants()}>
    <XIcon class="mr-2 h-4 w-4" />
    Remove
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Confirm plan enrollment cancellation</Dialog.Title>
    </Dialog.Header>
    <p>Are you sure you want to cancel this enrollment?</p>
    <Dialog.Footer>
      <Button
        on:click={() => {
          removeOpen = false;
        }}>
        Nevermind
      </Button>
      <Button on:click={remove}>Yes, remove them</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
