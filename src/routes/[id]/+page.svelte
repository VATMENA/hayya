<script lang="ts">
  import type { PageData } from "./$types";
  import { addItem, addPage, clearItems, setTitle } from "$lib/breadcrumbs";
  import { page } from "$app/stores";

  export let data: PageData;

  setTitle(`Hello, ${data.user.name}!`);
  $: {
    clearItems($page.data.url);
    addItem($page.data.url, '/switch_hq', data.facility.name);
    addPage($page.data.url, 'Dashboard');
  }
</script>