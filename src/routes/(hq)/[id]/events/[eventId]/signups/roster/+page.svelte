<script lang="ts">
  import type { PageData } from "./$types";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import Roster from "./roster.svelte";

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
      addItem(
        $page.data.url,
        `/${data.facility.id}/events/${data.event.id}/signups`,
        "Manage Signups",
      );
      addPage($page.data.url, "Event Roster");
    }
  }
</script>

<h2 class="!mb-2 text-3xl font-bold tracking-tight">
  Event Roster - {data.event?.name}
</h2>

<Roster {data} event={data.event} />
