<script lang="ts">
  import type { TrainingRequest } from "@prisma/client";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { can } from "$lib/perms/can";
  import { ASSIGN_MENTORS_TO_REQUEST, DELETE_REQUEST, SELF_ASSIGN_TO_REQUEST } from "$lib/perms/permissions";
  import * as Dialog from "$lib/components/ui/dialog";
  import { invalidateAll } from "$app/navigation";
  import { toast } from "svelte-sonner";
  import AssignForm from "./assign-form.svelte";
  import { page } from "$app/stores";

  export let request: TrainingRequest;

  let deleteOpen = false;

  async function deleteRequest() {
    let body = new URLSearchParams();
    body.set("id", request.id);
    await fetch("?/deleteRequest", {
      method: 'POST',
      body: body.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    deleteOpen = false;
    toast.success('Removed request successfully!');
    await invalidateAll(); // This component will be unloaded here, so we have to be careful not to do anything afterwards
  }

  let assignOpen = false;
  let selfassignOpen = false;
</script>

{#if can(ASSIGN_MENTORS_TO_REQUEST)}
  <Dialog.Root bind:open={assignOpen}>
    <Dialog.Trigger class={buttonVariants()}>Assign</Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Assign request to a mentor</Dialog.Title>
        <Dialog.Description>They'll be set as the assigned mentor for this request, and they should reach out to the user to work out a time with them to complete this session.</Dialog.Description>
      </Dialog.Header>
      <AssignForm form={$page.data.form} onsubmit={() => {assignOpen = false; toast.success("Instructor has been assigned to that request. Check the Assigned tab for details.");}} action="?/assign" requestId={request.id} />
    </Dialog.Content>
  </Dialog.Root>
{/if}
{#if can(SELF_ASSIGN_TO_REQUEST)}
  <Dialog.Root bind:open={selfassignOpen}>
    <Dialog.Trigger class={buttonVariants()}>Self-Assign</Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Assign request to yourself</Dialog.Title>
        <Dialog.Description>You'll be set as the assigned mentor for this request, and you should reach out to the user to work out a time with them to complete this session.</Dialog.Description>
      </Dialog.Header>
      <AssignForm form={$page.data.form} onsubmit={() => {selfassignOpen = false; toast.success("You've been assigned to that request. Check the Assigned tab for details.");}} forceCid={$page.data.user.id} action="?/selfAssign" requestId={request.id} />
    </Dialog.Content>
  </Dialog.Root>
{/if}
{#if can(DELETE_REQUEST)}
  <Dialog.Root bind:open={deleteOpen}>
    <Dialog.Trigger class={buttonVariants()}>Delete</Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Are you sure?</Dialog.Title>
        <Dialog.Description>This will remove the user's training request <b>permanently</b>.</Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Button on:click={() => {deleteOpen = false;}}>Nevermind</Button>
        <Button on:click={deleteRequest} type="submit" class="bg-red-600 text-red-950 hover:bg-red-700">Delete</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/if}