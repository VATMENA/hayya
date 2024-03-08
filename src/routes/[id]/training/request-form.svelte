<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { formSchema, type FormSchema } from "./request-form";
  import type { SuperValidated } from "sveltekit-superforms";
  import StartDay from "./avail-start-picker.svelte";
  import EndDay from "./avail-end-picker.svelte";

  export let form: SuperValidated<FormSchema>;
  export let onsubmit: any;

  let options = {
    onUpdated: ({ form }) => {
      if (form.valid) {
        onsubmit();
      }
    },
  };
</script>

<Form.Root
  method="POST"
  {options}
  {form}
  schema={formSchema}
  let:config
  action="?/requestTraining">
  <div class="space-y-4">
    <Form.Field {config} name="trainingType">
      <Form.Item class="flex flex-col">
        <Form.Label>What type of training do you need?</Form.Label>
        <Form.Input />
        <Form.Validation />
      </Form.Item>
    </Form.Field>
    <p>And what days might work?</p>
    <div class="grid grid-cols-2 gap-4">
      <StartDay {config} />
      <EndDay {config} />
    </div>
    <Form.Field {config} name="times">
      <Form.Item class="flex flex-col">
        <Form.Label>
          On the days selected above, what times might work?
        </Form.Label>
        <Form.Textarea
          placeholder="July 22 0300z-2400z, July 23 0400z-2400z, July 24 not available, July 25 0400-0500z"
          class="resize-none" />
        <Form.Description>
          Please be descriptive and use Zulu times.
        </Form.Description>
        <Form.Validation />
      </Form.Item>
    </Form.Field>
  </div>
  <Form.Button class="float-right">Request</Form.Button>
</Form.Root>
