<script lang="ts">
  import { toast } from "svelte-sonner";
  import type { PageData } from "./$types";
  import DataTable from "./data-table.svelte";

  export let data: PageData;
</script>

<h2 class="text-3xl font-bold tracking-tight">
  Manage Signups - {data.event?.name}
</h2>

<DataTable signups={data.event?.signups} />
