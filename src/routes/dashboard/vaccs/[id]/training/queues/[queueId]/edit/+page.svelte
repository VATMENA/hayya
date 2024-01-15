<script lang="ts">
  import type { PageData } from "./$types";
  import CreateForm from "./create-form.svelte";
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
        `vacc.${$page.params.id}.training.queues.manage`,
      )
    ) {
      goto(`/dashboard/vaccs/${$page.params.id}`);
    }
  });
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">
    Editing Training Queue - {data.queue.name}
  </h2>
</div>

<CreateForm form={data.form} queue={data.queue} />
