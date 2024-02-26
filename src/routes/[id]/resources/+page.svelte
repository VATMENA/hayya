<script lang="ts">
  import ResourcesPage from "$lib/components/resources_page/ResourcesPage.svelte";
  import type { PageData } from "./$types";
  import { page } from "$app/stores";

  export let data: PageData;
</script>

<ResourcesPage
  form={data.form}
  facilityId={$page.params.id}
  resources={data.resources} />
