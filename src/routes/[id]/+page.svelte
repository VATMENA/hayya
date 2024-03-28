<script lang="ts">
  import type { PageData } from "./$types";
  import { addItem, addPage, clearItems, title } from "$lib/breadcrumbs";
  import { page } from "$app/stores";

  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, '/switch_hq', data.facility.name);
    addPage($page.data.url, 'Dashboard');
  }
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">Hello, {data.user.name}</h2>
</div>