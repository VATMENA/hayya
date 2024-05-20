<script lang="ts">
  import DataTable from "./data-table.svelte";
  import type { PageData } from "./$types";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import { can } from "$lib/perms/can";
  import { MANAGE_QUEUES } from "$lib/perms/permissions";
  import Plus from "lucide-svelte/icons/plus";
  import * as Dialog from "$lib/components/ui/dialog";
  import CreateForm from "./create-form.svelte";

  export let data: PageData;
  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addItem($page.data.url, `/${data.facility.id}/training`, "Training");
    addPage($page.data.url, "Training Queues");
  }

  let createDialogOpen = false;
</script>

<PageHeader title="Training Queues">
  {#if can(MANAGE_QUEUES)}
    <Button
      on:click={() => {
        createDialogOpen = true;
      }}>
      <Plus class="mr-2 w-4 h-4" />
      Create
    </Button>
  {/if}
</PageHeader>

<DataTable queues={data.queues} canJoin={data.canJoin} memberOf={data.queue} />

<Dialog.Root bind:open={createDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create new training queue</Dialog.Title>
    </Dialog.Header>
    <CreateForm bind:open={createDialogOpen} data={data.createForm} />
  </Dialog.Content>
</Dialog.Root>
