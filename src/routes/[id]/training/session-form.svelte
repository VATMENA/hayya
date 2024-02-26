<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { formSchema, type FormSchema } from "./session-form";
  import type { SuperValidated } from "sveltekit-superforms";
  import DatePicker from "./date-picker.svelte";

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
  action="?/logSession">
  <div class="space-y-4">
    <div class="grid-cols-3 grid gap-4">
      <Form.Field {config} name="cid">
        <Form.Item class="flex flex-col">
          <Form.Label>CID</Form.Label>
          <Form.Input />
          <Form.Validation />
        </Form.Item>
      </Form.Field>
      <DatePicker {config} />
      <Form.Field {config} name="sessionType">
        <Form.Item class="flex flex-col">
          <Form.Label>Session Type</Form.Label>
          <Form.Input />
          <Form.Validation />
        </Form.Item>
      </Form.Field>
    </div>
    <div class="grid-cols-2 grid gap-4">
      <Form.Field {config} name="studentComments">
        <Form.Item class="flex flex-col">
          <Form.Label>Student Comments</Form.Label>
          <Form.Textarea
            placeholder="You did well at... and you could improve on..."
            class="resize-none" />
          <Form.Description>
            These comments will be visible to the student and other mentors. You
            can use Markdown to add links and styles.
          </Form.Description>
          <Form.Validation />
        </Form.Item>
      </Form.Field>
      <Form.Field {config} name="mentorComments">
        <Form.Item class="flex flex-col">
          <Form.Label>Mentor Comments</Form.Label>
          <Form.Textarea
            placeholder="Needs more practice with unexpected explosions and unauthorized takeoffs"
            class="resize-none" />
          <Form.Description>
            These comments will be visible only to other mentors. You can use
            Markdown to add links and styles.
          </Form.Description>
          <Form.Validation />
        </Form.Item>
      </Form.Field>
    </div>
  </div>
  <Form.Button class="float-right">Log Session</Form.Button>
</Form.Root>
