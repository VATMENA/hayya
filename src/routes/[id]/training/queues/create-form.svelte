<script lang="ts">
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import { createSchema, type CreateSchema } from "./create-schema";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Switch } from "$lib/components/ui/switch";

  export let data: SuperValidated<Infer<CreateSchema>>;

  const form = superForm(data, {
    validators: zodClient(createSchema)
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance action="?/create" class="space-y-2">
  <Form.Field {form} name="name">
    <Form.Control let:attrs>
      <Form.Label>Queue Name</Form.Label>
      <Input {...attrs} bind:value={$formData.name} placeholder="OBS -> S1" />
    </Form.Control>
    <Form.Description>A short name describing the queue.</Form.Description>
    <Form.FieldErrors/>
  </Form.Field>
  <Form.Field {form} name="description">
    <Form.Control let:attrs>
      <Form.Label>Description</Form.Label>
      <Textarea class="resize-none" {...attrs} bind:value={$formData.description} placeholder="Training track that will take you from OBS (Observer) to S1 (Developing Controller)." />
    </Form.Control>
    <Form.Description>A longer description of the queue.</Form.Description>
    <Form.FieldErrors/>
  </Form.Field>
  <Form.Field
    {form}
    name="openRegistration"
    class="flex flex-row items-center justify-between rounded-lg"
  >
    <Form.Control let:attrs>
      <div class="space-y-0.5">
        <Form.Label>Open registration?</Form.Label>
        <Form.Description>
          Switch on to allow anyone to join this queue without an instructor recommendation.
        </Form.Description>
      </div>
      <Switch
        {...attrs}
        includeInput
        bind:checked={$formData.openRegistration}
      />
    </Form.Control>
  </Form.Field>

  <Form.Button class="w-full">Create</Form.Button>
</form>