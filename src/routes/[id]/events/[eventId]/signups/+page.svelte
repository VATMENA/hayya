<script lang="ts">
  import type { PageData } from "./$types";
  import DataTable from "./data-table.svelte";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";

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
      addPage($page.data.url, "Manage signups");
    }
  }
</script>

<div class="flex justify-between">
  <h2 class="text-3xl font-bold tracking-tight !mb-2">
    Manage Signups - {data.event?.name}
  </h2>
  <Button>Create event roster</Button>
</div>

<DataTable signups={data.event?.signups} />
