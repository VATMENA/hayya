<script lang="ts">
  import type { PageData } from "./$types";
  import RecommendForm from "./recommend-form.svelte";
  import { onMount } from "svelte";
  import { can } from "$lib/perms/can";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  export let data: PageData;

  onMount(() => {
    if (
      !can(
        $page.data.roles,
        $page.params.id,
        $page.data.user.vaccId,
        `vacc.${$page.params.id}.training.queues.recommend`,
      )
    ) {
      goto(`/dashboard/vaccs/${$page.params.id}`);
    }
  });
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">
    Mark Student As Training Complete - {data.queue.name}
  </h2>
</div>

<p>
  Once a student is marked complete on a given training queue, they will not be
  able to join that queue again. If they are not marked complete, they may
  rejoin at any time, assuming they have a recommendation for that queue or it
  is open registration.
</p>

<RecommendForm form={data.form} queue={data.queue} />
