<script lang="ts">
  import type { PageData } from "./$types";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  import DataTable from "./DataTable.svelte";

  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addItem($page.data.url, `/${data.facility.id}/training`, "Training");
    addItem($page.data.url, `/${data.facility.id}/training/plans`, "Plans");
    addItem($page.data.url, `/${data.facility.id}/training/plans`, data.plan.name);
    addPage($page.data.url, "Members");
  }
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">{data.plan.name} Members</h2>
</div>

<DataTable data={data.planRegistrations} />
