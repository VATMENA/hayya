<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { formSchema, type FormSchema } from "./assign";
  import type { SuperValidated } from "sveltekit-superforms";

  export let form: SuperValidated<FormSchema>;
  export let onsubmit: any;
  export let forceCid: string | null = null;
  export let requestId: string;
  export let action: string;

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
  {action}>
  <div class="space-y-4">
    <input type="hidden" id="requestId" name="requestId" value={requestId} />
    {#if forceCid}
      <input type="hidden" id="instructorId" name="instructorId" value={forceCid} />
    {:else}
      <Form.Field {config} name="instructorId">
        <Form.Item class="flex flex-col">
          <Form.Label>Instructor's CID</Form.Label>
          <Form.Input />
          <Form.Validation />
        </Form.Item>
      </Form.Field>
    {/if}
  </div>
  <Form.Button class="float-right">Assign</Form.Button>
</Form.Root>
