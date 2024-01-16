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
    Recommend Student For Training - {data.queue.name}
  </h2>
</div>

<p>Recommending a student for a queue allows them to enroll in the queue, even if public enrollment is disabled. Only do this once they have completed their current queue, and have been marked complete there, and are ready to move to the next stage.</p>

<RecommendForm form={data.form} queue={data.queue} />
