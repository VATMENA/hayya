<script lang="ts">
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import { can } from "$lib/perms/can";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import { MANAGE_QUEUES } from "$lib/perms/permissions";
  import { toast } from "svelte-sonner";

  export let data: PageData;

  onMount(() => {
    if (!can(MANAGE_QUEUES)) {
      goto(`/${$page.params.id}`);
    }
  });

  async function remove() {
    await fetch("?", {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: ""
    });
    await goto(`/${$page.params.id}/training/queues/`);
    toast.success("Queue deleted successfully");
  }
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
  on:click={remove}>
  I'm sure
</Button>
<Button variant="outline" href="/{$page.params.id}/training/queues/manage">
  Nevermind
</Button>
