<script lang="ts">
  // @formatter:off
  import * as Form from "$lib/components/ui/form";
  // @formatter:on
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import { formSchema, type FormSchema } from "./schema";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Input } from "$lib/components/ui/input";
  import { LoaderCircle } from "lucide-svelte";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Switch } from "$lib/components/ui/switch";

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

<form method="POST" action="?/create" use:enhance class="space-y-4">
  <Form.Field {form} name="name">
    <Form.Control let:attrs>
      <Form.Label>Resource Name</Form.Label>
      <Input {...attrs} bind:value={$formData.name} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="description">
    <Form.Control let:attrs>
      <Form.Label>Description</Form.Label>
      <Textarea
        class="resize-none"
        {...attrs}
        bind:value={$formData.description} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="url">
    <Form.Control let:attrs>
      <Form.Label>File URL</Form.Label>
      <Input {...attrs} bind:value={$formData.url} />
    </Form.Control>
    <Form.Description>
      This must be accessible by anyone who should be able to view this
      resource!
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="isPublic" class="flex flex-row justify-between">
    <Form.Control let:attrs>
      <div class="space-y-0.5">
        <Form.Label>Public resource?</Form.Label>
        <Form.Description>
          If checked, visible to anyone instead of staff only.
        </Form.Description>
      </div>
      <Switch includeInput {...attrs} bind:checked={$formData.isPublic} />
    </Form.Control>
  </Form.Field>

  <Form.Button class="w-full">
    {#if $delayed}
      <LoaderCircle class="h-5 w-5 animate-spin" />
    {:else}
      Create Resource
    {/if}
  </Form.Button>
</form>
