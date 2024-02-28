<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import * as Dialog from "$lib/components/ui/dialog";
  import { invalidateAll } from "$app/navigation";

  export let id: string;

  let deleteOpen = false;

  async function removeIt() {
    await fetch("?/delete", {
      method: "POST",
      body: `id=${id}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    await invalidateAll();
    toast.success("Facility removed successfully!");
  }
</script>

<Button href="/{id}/" variant="outline">Open HQ</Button>
<Dialog.Root bind:open={deleteOpen}>
  <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
    Remove
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Are you sure?</Dialog.Title>
      <Dialog.Description>
        This is an <b>incredibly destructive operation</b>
        . All data associated with this facility and it's membership information
        will be permanently obliterated!
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button
        type="submit"
        on:click={() => {
          deleteOpen = false;
        }}>
        Nevermind
      </Button>
      <Button
        type="submit"
        on:click={() => {
          removeIt();
          deleteOpen = false;
        }}
        class="bg-red-600 text-red-950 hover:bg-red-700 hover:text-red-950">
        I'm sure
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
