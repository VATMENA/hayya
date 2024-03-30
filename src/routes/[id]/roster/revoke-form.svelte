<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { formSchema, type FormSchema } from "./revoke-form";
  import type { SuperValidated } from "sveltekit-superforms";

  export let form: SuperValidated<FormSchema>;
  export let onsubmit: any;
  export let id: number;

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
  action="?/revokeCertificate">
  <input type="hidden" name="id" value={id} />
  <div class="space-y-4">
    <div class="grid-cols-2 grid gap-4">
      <Form.Field {config} name="studentComments">
        <Form.Item class="flex flex-col">
          <Form.Label>Student Comments</Form.Label>
          <Form.Textarea
            placeholder="I watched you crash a plane into a mountain. Please get more practice with this and try again."
            class="resize-none" />
          <Form.Description>
            These comments will be visible to the student <b>and</b>
            other mentors. You can use Markdown to add links and styles.
          </Form.Description>
          <Form.Validation />
        </Form.Item>
      </Form.Field>
      <Form.Field {config} name="mentorComments">
        <Form.Item class="flex flex-col">
          <Form.Label>Mentor Comments</Form.Label>
          <Form.Textarea
            placeholder="Needs more practice with unexpected explosions and unauthorized takeoffs."
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
  <Form.Button class="float-right bg-red-500 text-red-950 hover:bg-red-600">
    Revoke Certificate
  </Form.Button>
</Form.Root>
