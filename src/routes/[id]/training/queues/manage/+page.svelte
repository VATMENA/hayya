<script lang="ts">
  import { onMount } from "svelte";
  import { can } from "$lib/perms/can";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import DataTable from "./data-table.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Plus } from "lucide-svelte";
  import type { PageData } from "./$types";
  import {MANAGE_QUEUES, RECOMMEND_FOR_QUEUE} from "$lib/perms/permissions";

  export let data: PageData;

  onMount(() => {
    if (
      !(can(MANAGE_QUEUES) || can(RECOMMEND_FOR_QUEUE))
    ) {
      goto(`/${$page.params.id}`);
    }
  });
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Manage Training Queues</h2>
  {#if can($page.data.roles, $page.params.id, $page.data.user.vaccId, `vacc.${$page.params.id}.training.queues.manage`)}
    <Button
      href="/{$page.params.id}/training/queues/create"
      class="align-middle">
      <Plus class="mr-2 w-4 h-4" />
      Create
    </Button>
  {/if}
</div>

<DataTable queues={data.queues} />
