<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs";
  import type { PageData } from "./$types";
  import DataTable from "./data-table.svelte";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";

  export let data: PageData;
  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addItem($page.data.url, `/${data.facility.id}/training`, "Training");
    addPage($page.data.url, "Training Requests");
  }
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">Training Requests</h2>
</div>

<Tabs.Root value="unassigned">
  <Tabs.List class="grid w-full grid-cols-3">
    <Tabs.Trigger value="unassigned">Unassigned</Tabs.Trigger>
    <Tabs.Trigger value="assigned">Assigned</Tabs.Trigger>
    <Tabs.Trigger value="expired">Expired</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="unassigned">
    <DataTable data={data.unassigned} />
  </Tabs.Content>
  <Tabs.Content value="assigned">
    <DataTable data={data.assigned} />
  </Tabs.Content>
  <Tabs.Content value="expired">
    <DataTable data={data.expired} />
  </Tabs.Content>
</Tabs.Root>
