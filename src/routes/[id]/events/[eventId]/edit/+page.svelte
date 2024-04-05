<script lang="ts">
  import { toast } from "svelte-sonner";
  import type { PageData } from "./$types";
  import EditForm from "./edit-form.svelte";

  export let data: PageData;
</script>

<h2 class="text-3xl font-bold tracking-tight">
  Configure Event - {data.event?.name}
</h2>

<EditForm
  form={data.editForm}
  event={data.event}
  onSubmit={() => {
    toast.success("Event configured successfully");
  }} />
