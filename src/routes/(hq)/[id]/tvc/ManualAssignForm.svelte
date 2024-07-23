<script lang="ts">
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import { formSchema, type FormSchema } from "./schema";
  import { superForm } from "sveltekit-superforms/client";
  import * as Form from "$lib/components/ui/form";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Input } from "$lib/components/ui/input";
  import { LoaderCircle } from "lucide-svelte";

  export let data: SuperValidated<Infer<FormSchema>>;

  export let onsubmit: () => void;

  const form = superForm(data, {
    validators: zodClient(formSchema),
    onUpdated({ form }) {
      if (form.valid) {
        onsubmit();
      }
    },
  });

  const { form: formData, enhance, delayed } = form;
</script>

<form method="POST" action="?/manAssign" use:enhance>
  <Form.Field {form} name="cid">
    <Form.Control let:attrs>
      <Form.Label>CID</Form.Label>
      <Input {...attrs} name="cid" bind:value={$formData.cid} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Button>
    {#if $delayed}
      <LoaderCircle class="h-5 w-5 animate-spin" />
    {:else}
      Add Visitor
    {/if}
  </Form.Button>
</form>
