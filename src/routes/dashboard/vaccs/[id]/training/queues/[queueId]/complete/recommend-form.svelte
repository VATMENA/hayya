<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { formSchema, type FormSchema } from "./schema";
  import type { SuperValidated } from "sveltekit-superforms";
  import { Button } from "$lib/components/ui/button";
  import { page } from "$app/stores";

  export let form: SuperValidated<FormSchema>;
</script>

<Form.Root
  method="POST"
  {form}
  schema={formSchema}
  let:config
  class="space-y-3">
  <Form.Field {config} name="cid">
    <Form.Item>
      <Form.Label>CID</Form.Label>
      <Form.Input autocomplete="off" />
      <Form.Description>
        CID of the user
      </Form.Description>
      <Form.Validation />
    </Form.Item>
  </Form.Field>
  <Form.Button>Mark Complete</Form.Button>
  <Button
    href="/dashboard/vaccs/{$page.params.id}/training/queues/manage"
    variant="outline">
    Nevermind
  </Button>
</Form.Root>
