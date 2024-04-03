<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Plus } from "lucide-svelte";
  import type { PageData } from "./$types";
  import DataTable from "./data-table.svelte";
  import { can } from "$lib/perms/can";
  import { MANAGE_QUEUES } from "$lib/perms/permissions";
  import AddForm from "./add-form.svelte";
  import { formSchema } from "./add-form";
  import { toast } from "svelte-sonner";

  export let data: PageData;

  let addOpen = false;

  $: members = data.queue?.members;
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">{data.queue?.name}</h2>
  {#if can(MANAGE_QUEUES)}
    <Button on:click={() => (addOpen = true)}>
      <Plus class="mr-2 w-4 h-4" /> Add student
    </Button>
  {/if}
</div>

{#if members && members.length > 0}
  <DataTable {members} />
{:else}
  <p>No members in this queue.</p>
{/if}

{#if can(MANAGE_QUEUES)}
  <Dialog.Root bind:open={addOpen}>
    <Dialog.Content class="max-w-[25vw]">
      <Dialog.Header>
        <Dialog.Title>Add student to queue</Dialog.Title>
      </Dialog.Header>
      <AddForm
        form={data.form}
        onSubmit={() => {
          addOpen = false;
          toast.success("Student added to queue");
        }} />
    </Dialog.Content>
  </Dialog.Root>
{/if}
