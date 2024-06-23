<script lang="ts">
  import type { PageData } from "./$types";
  import DataTable from "./data-table.svelte";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";

  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addItem($page.data.url, `/${data.facility.id}/events`, "Events");
    if (data.event) {
      addItem(
        $page.data.url,
        `/${data.facility.id}/events/${data.event.id}`,
        data.event.name,
      );
      addPage($page.data.url, "Manage Signups");
    }
  }
</script>

<div class="flex justify-between">
  <h2 class="!mb-2 text-3xl font-bold tracking-tight">
    Manage Signups - {data.event?.name}
  </h2>
  <Button
    on:click={() =>
      goto(`/${data.facility.id}/events/${data.event?.id}/signups/roster`)}>
    Create event roster
  </Button>
</div>

<DataTable signups={data.event?.signups} />
