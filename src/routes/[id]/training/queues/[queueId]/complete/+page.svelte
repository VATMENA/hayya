<script lang="ts">
  import type { PageData } from "./$types";
  import RecommendForm from "./recommend-form.svelte";

  export let data: PageData;
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
