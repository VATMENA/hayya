<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { formSchema, type FormSchema } from "./add-form";
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Input } from "$lib/components/ui/input";
  import { LoaderCircle } from "lucide-svelte";

  export let data: SuperValidated<Infer<FormSchema>>;
  export let onSubmit: any;

  const form = superForm(data, {
    validators: zodClient(formSchema),
    onUpdated({ form }) {
      if (form.valid) {
        onSubmit();
      }
    },
  });

  const { form: formData, enhance, delayed } = form;
</script>

<form method="POST" action="?/addStudent" use:enhance>
  <Form.Field name="id" {form}>
    <Form.Control let:attrs>
      <Form.Label>Student CID</Form.Label>
      <Input {...attrs} bind:value={$formData.id} />
    </Form.Control>
  </Form.Field>
  <Form.Button class="w-full">
    {#if $delayed}
      <LoaderCircle class="animate-spin w-5 h-5" />
    {:else}
      Add Student
    {/if}
  </Form.Button>
</form>
