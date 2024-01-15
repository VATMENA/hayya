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
  <Form.Field {config} name="name">
    <Form.Item>
      <Form.Label>Name</Form.Label>
      <Form.Input autocomplete="off" />
      <Form.Description>
        Short name for the new training queue.
      </Form.Description>
      <Form.Validation />
    </Form.Item>
  </Form.Field>
  <Form.Field {config} name="description">
    <Form.Item>
      <Form.Label>Description</Form.Label>
      <Form.Input autocomplete="off" />
      <Form.Description>
        Long description for the new training queue.
      </Form.Description>
      <Form.Validation />
    </Form.Item>
  </Form.Field>
  <Form.Field {config} name="openRegistration">
    <Form.Item class="flex flex-row items-start space-x-3 space-y-0">
      <Form.Checkbox />
      <div class="space-y-1 leading-none">
        <Form.Label>Allow open registration</Form.Label>
        <Form.Description>
          If enabled, anyone can join this queue at any time. If disabled, an
          instructor recommendation is required to join.
        </Form.Description>
      </div>
    </Form.Item>
  </Form.Field>
  <Form.Button>Save</Form.Button>
  <Button
    href="/dashboard/vaccs/{$page.params.id}/training/queues/manage"
    variant="outline">
    Nevermind
  </Button>
</Form.Root>
