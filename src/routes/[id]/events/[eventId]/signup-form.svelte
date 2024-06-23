<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { superForm, type SuperValidated } from "sveltekit-superforms";
  import { formSchema, type FormSchema } from "./signup-form";
  import { zodClient, type Infer } from "sveltekit-superforms/adapters";
  import * as Select from "$lib/components/ui/select";
  import { _as } from "$lib/typescriptMagic";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";

  export let data: SuperValidated<Infer<FormSchema>>;
  export let event: any;
  export let onSubmit: any;

  const form = superForm(data, {
    validators: zodClient(formSchema),
    onUpdated({ form }) {
      if (form.valid) {
        onSubmit();
      }
    },
  });

  const { form: formData, enhance, delayed } = form;

  $: selectedPosition = {
    label: $formData.desiredPosition,
    value: $formData.desiredPosition,
  };
</script>

<form method="POST" use:enhance action="?/signup">
  <Form.Field {form} name="desiredPosition">
    <Form.Control let:attrs>
      <Form.Label>Desired position</Form.Label>
      <Select.Root
        selected={selectedPosition}
        onSelectedChange={(v) => {
          v && ($formData.desiredPosition = _as(v.value));
        }}>
        <Select.Trigger {...attrs}>
          <Select.Value placeholder="Select position" />
        </Select.Trigger>
        <Select.Content>
          {#each event.positions as position (position)}
            <Select.Item value={position}>{position}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
      <input
        type="hidden"
        bind:value={$formData.desiredPosition}
        name="desiredPosition" />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <div class="mb-3 mt-2 grid grid-cols-2 gap-4">
    <Form.Field {form} name="availableFrom">
      <Form.Control let:attrs>
        <Form.Label>Available from (UTC hhmm)</Form.Label>
        <Input {...attrs} bind:value={$formData.availableFrom} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="availableTo">
      <Form.Control let:attrs>
        <Form.Label>Available to (UTC hhmm)</Form.Label>
        <Input {...attrs} bind:value={$formData.availableTo} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  </div>

  <Form.Field {form} name="comments">
    <Form.Control let:attrs>
      <Form.Label>Comments</Form.Label>
      <Textarea {...attrs} bind:value={$formData.comments} />
    </Form.Control>
  </Form.Field>

  <Form.Button class="float-right mt-4">Sign up</Form.Button>
</form>
