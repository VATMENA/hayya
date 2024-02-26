<script lang="ts">
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import { can } from "$lib/perms/can";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";

  export let data: PageData;
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">
    Are you sure you want to leave the queue?
  </h2>
</div>

<p>
  Are you sure you want to leave <b>{data.queue.name}</b>
  ?
</p>
<p>
  Your registrations will be removed, and any progress in the queue will be
  lost.
</p>
<b class="text-red-500">
  This cannot be undone! Re-joining will place you at the back of the queue.
</b>

<Button
  variant="destructive"
  href="/{$page.params.id}/training/queues/{$page.params
    .queueId}/leave/confirmed">
  I'm sure
</Button>
<Button variant="outline" href="/{$page.params.id}/training">Nevermind</Button>
