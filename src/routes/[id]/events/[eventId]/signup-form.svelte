<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { formSchema } from "./signup-form";

  export let form: any;
  export let event: any;
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
  {form}
  schema={formSchema}
  action="?/signup"
  {options}
  let:config>
  <Form.Field {config} name="desiredPosition">
    <Form.Label>Desired position</Form.Label>
    <Form.Select>
      <Form.SelectTrigger class="w-[180px]" placeholder="Select position" />
      <Form.SelectContent>
        {#each event.positions as position (position)}
          <Form.SelectItem value={position}>{position}</Form.SelectItem>
        {/each}
      </Form.SelectContent>
    </Form.Select>
    <Form.Validation />
  </Form.Field>
  <div class="grid grid-cols-2 gap-4 mt-2 mb-3">
    <div>
      <Form.Field {config} name="availableFrom">
        <Form.Label>Available from (UTC hhmm)</Form.Label>
        <Form.Input />
        <Form.Validation />
      </Form.Field>
    </div>
    <div>
      <Form.Field {config} name="availableTo">
        <Form.Label>Available to (UTC hhmm)</Form.Label>
        <Form.Input />
        <Form.Validation />
      </Form.Field>
    </div>
  </div>
  <Form.Field {config} name="comments">
    <Form.Label>Comments</Form.Label>
    <Form.Textarea />
    <Form.Validation />
  </Form.Field>
  <Form.Button class="float-right mt-4">Sign up</Form.Button>
</Form.Root>
