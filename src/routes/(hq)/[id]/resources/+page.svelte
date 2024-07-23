<script lang="ts">
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  import type { PageData } from "./$types";
  // @formatter:off
  import * as Dialog from "$lib/components/ui/dialog";
  // @formatter:on
  import PlusIcon from "lucide-svelte/icons/plus";
  import { Button } from "$lib/components/ui/button";
  import { can } from "$lib/perms/can";
  import { MANAGE_RESOURCES } from "$lib/perms/permissions";
  import CreateResourceForm from "./CreateResourceForm.svelte";
  import { toast } from "svelte-sonner";
  import { writable } from "svelte/store";
  import { createTable } from "svelte-headless-table";
  import DataTable from "./DataTable.svelte";

  export let data: PageData;
  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addPage($page.data.url, "Resources");
  }

  let createDialogOpen = false;
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-2xl font-bold tracking-tight md:text-3xl">Resources</h2>
  {#if can(MANAGE_RESOURCES)}
    <Button
      on:click={() => {
        createDialogOpen = true;
      }}>
      <PlusIcon class="mr-2 h-4 w-4" />
      Create
    </Button>
  {/if}
</div>

<div class="flex pt-2">
  <DataTable data={data.resources} />
</div>

{#if can(MANAGE_RESOURCES)}
  <Dialog.Root bind:open={createDialogOpen}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Create new resource</Dialog.Title>
      </Dialog.Header>
      <CreateResourceForm
        data={data.form}
        onsubmit={() => {
          createDialogOpen = false;
          toast.success("New resource created successfully!");
        }} />
    </Dialog.Content>
  </Dialog.Root>
{/if}
