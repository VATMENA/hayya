<script lang="ts">
  import type { PageData } from "./$types";
  import CreateForm from "./create-form.svelte";

  export let data: PageData;
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">
    Editing Training Queue - {data.queue.name}
  </h2>
</div>

<CreateForm form={data.form} queue={data.queue} />
