<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { formSchema, type FormSchema } from "./assign";
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Input } from "$lib/components/ui/input";
  import { LoaderCircle } from "lucide-svelte";

  export let data: SuperValidated<Infer<FormSchema>>;
  export let onsubmit: any;
  export let forceCid: string | null = null;
  export let requestId: string;
  export let action: string;

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

<form method="POST" use:enhance {action}>
  <div class="space-y-4">
    <input type="hidden" id="requestId" name="requestId" value={requestId} />
    {#if forceCid}
      <input
        type="hidden"
        id="instructorId"
        name="instructorId"
        value={forceCid} />
    {:else}
      <Form.Field {form} name="instructorId">
        <Form.Control let:attrs>
          <Form.Label>Instructor's CID</Form.Label>
          <Input {...attrs} bind:value={$formData.instructorId} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    {/if}
  </div>
  <Form.Button class="w-full">
    {#if $delayed}
      <LoaderCircle class="h-5 w-5 animate-spin" />
    {:else}
      Assign
    {/if}
  </Form.Button>
</form>
