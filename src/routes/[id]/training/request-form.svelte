<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { formSchema, type FormSchema } from "./request-form";
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Input } from "$lib/components/ui/input";
  import DatePicker from "$lib/components/DatePicker.svelte";
  import { getLocalTimeZone, today } from "@internationalized/date";
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

<form method="POST" use:enhance action="?/requestTraining" class="space-y-4">
  <Form.Field {form} name="trainingType">
    <Form.Control let:attrs>
      <Form.Label>What type of training do you need?</Form.Label>
      <Input {...attrs} bind:value={$formData.trainingType} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <p>And what days might work?</p>

  <div class="grid grid-cols-2 gap-4">
    <Form.Field {form} name="dateStart" class="flex flex-col">
      <Form.Control let:attrs>
        <Form.Label>From...</Form.Label>
        <DatePicker
          form={formData}
          name="dateStart"
          minValue={today(getLocalTimeZone())}
          {attrs} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="dateEnd" class="flex flex-col">
      <Form.Control let:attrs>
        <Form.Label>To...</Form.Label>
        <DatePicker
          form={formData}
          name="dateEnd"
          minValue={today(getLocalTimeZone())}
          {attrs} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  </div>

  <Form.Field {form} name="times">
    <Form.Control let:attrs>
      <Form.Label>On the dates above, what times might work?</Form.Label>
      <Textarea
        {...attrs}
        class="resize-none"
        placeholder="July 22 0300z-2400z, July 23 0400z-2400z, July 24 not available, July 25 0400-0500z"
        bind:value={$formData.times} />
    </Form.Control>
    <Form.Description>
      Please be descriptive and use Zulu times.
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Button class="w-full">Request</Form.Button>
</form>
