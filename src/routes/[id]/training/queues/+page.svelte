<script lang="ts">
  import DataTable from "./data-table.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Available Training Queues</h2>
</div>

<DataTable queues={data.queues} canJoin={data.canJoin} memberOf={data.queue} />
