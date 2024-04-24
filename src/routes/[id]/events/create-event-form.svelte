<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { formSchema, type FormSchema } from "./schema";
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import DatePicker from "$lib/components/DatePicker.svelte";
  import Loader2Icon from "lucide-svelte/icons/loader";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea/index.js";

  export let data: SuperValidated<Infer<FormSchema>>;

  export let onsubmit: any;

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

<form method="POST" action="?/create" use:enhance>
  <div class="space-y-2">
    <Form.Field class="flex flex-col" {form} name="name">
      <Form.Control let:attrs>
        <Form.Label>Event Name</Form.Label>
        <Input {...attrs} bind:value={$formData.name} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <div class="grid grid-cols-2 gap-4">
      <Form.Field class="flex flex-col" {form} name="startDate">
        <Form.Control let:attrs>
          <Form.Label>Start Date</Form.Label>
          <DatePicker name="startDate" form={formData} {attrs} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field class="flex flex-col" {form} name="startTime">
        <Form.Control let:attrs>
          <Form.Label>Start Time (UTC, HHMM)</Form.Label>
          <Input {...attrs} bind:value={$formData.startTime} type="number" min={0} max={2359} />
        </Form.Control>
      </Form.Field>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <Form.Field class="flex flex-col" {form} name="endDate">
        <Form.Control let:attrs>
          <Form.Label>End Date</Form.Label>
          <DatePicker name="endDate" form={formData} {attrs} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field class="flex flex-col" {form} name="endTime">
        <Form.Control let:attrs>
          <Form.Label>End Time (UTC, HHMM)</Form.Label>
          <Input {...attrs} bind:value={$formData.endTime} type="number" min={0} max={2359} />
        </Form.Control>
      </Form.Field>
    </div>

    <Form.Field class="flex flex-col" {form} name="description">
      <Form.Control let:attrs>
        <Form.Label>Event Description</Form.Label>
        <Textarea {...attrs} class="resize-none" bind:value={$formData.description} />
      </Form.Control>
      <Form.FieldErrors />
      <Form.Description>You can use markdown to add links and styles.</Form.Description>
    </Form.Field>

    <Form.Field class="flex flex-col" {form} name="bannerUrl">
      <Form.Control let:attrs>
        <Form.Label>Banner Image URL</Form.Label>
        <Input {...attrs} bind:value={$formData.bannerUrl} />
      </Form.Control>
      <Form.FieldErrors />
      <Form.Description>Images may take several minutes to process. Please be patient!</Form.Description>
    </Form.Field>

    <Form.Button class="w-full">
      {#if $delayed}
        <Loader2Icon class="w-4 h-4 animate-spin" />
      {:else}
        Create Event
      {/if}
    </Form.Button>
  </div>
</form>