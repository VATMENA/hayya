<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { formSchema, type FormSchema } from "./add-form";
  import type { SuperValidated } from "sveltekit-superforms";

  export let form: SuperValidated<FormSchema>;
  export let onSubmit: any;

  let options = {
    onUpdated: ({ form }) => {
      if (form.valid) {
        onSubmit();
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
  action="?/addStudent">
  <div class="space-y-4">
    <Form.Field {config} name="id">
      <Form.Label>Student CID</Form.Label>
      <Form.Input />
      <Form.Validation />
    </Form.Field>
  </div>
  <Form.Button class="float-right">Add student</Form.Button>
</Form.Root>
