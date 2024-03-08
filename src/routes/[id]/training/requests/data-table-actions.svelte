<script lang="ts">
  import type { TrainingRequest } from "@prisma/client";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { can } from "$lib/perms/can";
  import { ASSIGN_MENTORS_TO_REQUEST, DELETE_REQUEST, SELF_ASSIGN_TO_REQUEST } from "$lib/perms/permissions";
  import * as Dialog from "$lib/components/ui/dialog";

  export let request: TrainingRequest;
</script>

{#if can(ASSIGN_MENTORS_TO_REQUEST)}
  <Dialog.Root>
    <Dialog.Trigger class={buttonVariants()}>Assign</Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Assign request to a mentor</Dialog.Title>
      </Dialog.Header>
    </Dialog.Content>
  </Dialog.Root>
{/if}
{#if can(SELF_ASSIGN_TO_REQUEST)}
  <Dialog.Root>
    <Dialog.Trigger class={buttonVariants()}>Self-Assign</Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Assign request to yourself</Dialog.Title>
      </Dialog.Header>
    </Dialog.Content>
  </Dialog.Root>
{/if}
{#if can(DELETE_REQUEST)}
  <Dialog.Root>
    <Dialog.Trigger class={buttonVariants()}>Delete</Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Are you sure?</Dialog.Title>
      </Dialog.Header>
    </Dialog.Content>
  </Dialog.Root>
{/if}