<script lang="ts">
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import { can } from "$lib/perms/can";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";

  export let data: PageData;

  onMount(() => {
    if (
      !can(
        $page.data.roles,
        $page.params.id,
        $page.data.user.vaccId,
        `vacc.${$page.params.id}.training.queues.manage`,
      )
    ) {
      goto(`/dashboard/vaccs/${$page.params.id}`);
    }
  });
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Confirm Deletion</h2>
</div>

<p>
  Are you sure you want to delete <b>{data.queue.name}</b>
  ?
</p>
<p>
  All registrations will be removed and the queue will be deleted permanently.
</p>
<b class="text-red-500">This cannot be undone!</b>

<Button
  variant="destructive"
  href="/dashboard/vaccs/{$page.params.id}/training/queues/{$page.params
    .queueId}/delete/confirmed">
  I'm sure
</Button>
<Button
  variant="outline"
  href="/dashboard/vaccs/{$page.params.id}/training/queues/manage">
  Nevermind
</Button>
