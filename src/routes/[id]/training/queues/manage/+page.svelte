<script lang="ts">
  import { can } from "$lib/perms/can";
  import { page } from "$app/stores";
  import DataTable from "./data-table.svelte";
  import { Button } from "$lib/components/ui/button";
  import Plus from "lucide-svelte/icons/plus";
  import type { PageData } from "./$types";
  import { MANAGE_QUEUES } from "$lib/perms/permissions";

  export let data: PageData;
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Manage Training Queues</h2>
  {#if can(MANAGE_QUEUES)}
    <Button
      href="/{$page.params.id}/training/queues/create"
      class="align-middle">
      <Plus class="mr-2 w-4 h-4" />
      Create
    </Button>
  {/if}
</div>

<DataTable queues={data.facility.trainingQueues} />
