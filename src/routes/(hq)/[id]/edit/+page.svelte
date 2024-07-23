<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import EditForm from "./EditForm.svelte";

  export let data: PageData;
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">
    Editing vACC - {$page.params.id}
  </h2>
</div>

<EditForm data={data.form} />
