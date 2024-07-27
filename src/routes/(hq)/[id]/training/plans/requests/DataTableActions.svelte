<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { CheckIcon, XIcon } from "lucide-svelte";
  import { invalidateAll } from "$app/navigation";
  import { toast } from "svelte-sonner";

  export let id: string;

  let approveOpen = false;
  async function approve() {
    let data = new URLSearchParams();
    data.set("id", id);
    await fetch("?/enroll", {
      method: 'POST',
      body: data.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": document.cookie
      }
    });
    await invalidateAll();
    approveOpen = false;
    toast.success('User enrollment approved successfully!');
  }
  let rejectOpen = false;
  async function reject() {
    let data = new URLSearchParams();
    data.set("id", id);
    await fetch("?/reject", {
      method: 'POST',
      body: data.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": document.cookie
      }
    });
    await invalidateAll();
    rejectOpen = false;
    toast.success('User enrollment rejected successfully!');
  }
</script>

<Dialog.Root bind:open={approveOpen}>
  <Dialog.Trigger class={buttonVariants()}>
    <CheckIcon class="w-4 h-4 mr-2" />
    Approve
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Confirm plan approval</Dialog.Title>
    </Dialog.Header>
    <p>Ensure the user meets all necessary requirements to join this plan prior to approving their enrollment. Are you sure you want to approve this enrollment?</p>
    <Dialog.Footer>
      <Button on:click={() => {approveOpen = false;}}>Nevermind</Button>
      <Button on:click={approve}>Yes, enroll them</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
<Dialog.Root bind:open={rejectOpen}>
  <Dialog.Trigger class={buttonVariants()}>
    <XIcon class="w-4 h-4 mr-2" />
    Reject
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Confirm plan enrollment rejection</Dialog.Title>
    </Dialog.Header>
    <p>Are you sure you want to reject this enrollment?</p>
    <Dialog.Footer>
      <Button on:click={() => {approveOpen = false;}}>Nevermind</Button>
      <Button on:click={reject}>Yes, reject it</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>