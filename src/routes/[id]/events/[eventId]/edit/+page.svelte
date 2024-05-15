<script lang="ts">
  import { toast } from "svelte-sonner";
  import type { PageData } from "./$types";
  import EditForm from "./edit-form.svelte";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";

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
      addPage($page.data.url, "Configure");
    }
  }
</script>

<h2 class="text-3xl font-bold tracking-tight">
  Configure Event - {data.event?.name}
</h2>

<EditForm
  data={data.editForm}
  event={data.event}
  onSubmit={() => {
    toast.success("Event configured successfully");
  }} />
