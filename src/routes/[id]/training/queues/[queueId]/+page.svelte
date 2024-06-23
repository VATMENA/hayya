<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Plus } from "lucide-svelte";
  import type { PageData } from "./$types";
  import DataTable from "./data-table.svelte";
  import { can } from "$lib/perms/can";
  import { MANAGE_QUEUES } from "$lib/perms/permissions";
  import AddForm from "./add-form.svelte";
  import { toast } from "svelte-sonner";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";

  export let data: PageData;

  let addOpen = false;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addItem($page.data.url, `/${data.facility.id}/training`, "Training");
    addItem($page.data.url, `/${data.facility.id}/training/queues`, "Queues");
    addPage($page.data.url, (data.queue && data.queue.name) || "Queue Details");
  }

  $: members = data.queue?.members;
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">{data.queue?.name}</h2>
  {#if can(MANAGE_QUEUES)}
    <Button on:click={() => (addOpen = true)}>
      <Plus class="mr-2 h-4 w-4" /> Add student
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
        <Dialog.Description>
          This will manually add a student to the training queue. If you wish to
          permit the student to join a closed queue, use the 'Recommend Student'
          option instead.
        </Dialog.Description>
      </Dialog.Header>
      <AddForm
        data={data.form}
        onSubmit={() => {
          addOpen = false;
          toast.success("Student added to queue");
        }} />
    </Dialog.Content>
  </Dialog.Root>
{/if}
