<script lang="ts">
  import type { PageData } from "./$types";
  import DataTable from "./data-table.svelte";

  export let data: PageData;

  $: members = data.queue?.members;
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">{data.queue?.name}</h2>
</div>

{#if members && members.length > 0}
  <DataTable {members} />
{:else}
  <p>No members in this queue.</p>
{/if}
