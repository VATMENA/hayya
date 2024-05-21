<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import {
    superForm,
    type Infer,
    type SuperValidated,
  } from "sveltekit-superforms";
  import { formSchema, type FormSchema } from "./create-form";
  import { zodClient } from "sveltekit-superforms/adapters";
  import * as Select from "$lib/components/ui/select";
  import { _as } from "$lib/typescriptMagic";

  export let data: SuperValidated<Infer<FormSchema>>;
  export let onSubmit: any;
  export let event: any;

  const form = superForm(data, {
    validators: zodClient(formSchema),
    onUpdated: ({ form }) => {
      if (form.valid) {
        onSubmit({
          position: $formData.position,
          user: event.signups.find((s: any) => s.userId === $formData.userId)
            ?.user,
        });
      }
    },
  });

  const { form: formData, enhance, delayed } = form;

  $: selectedPosition = {
    label: $formData.position,
    value: $formData.position,
  };

  $: selectedUser =
    {
      label: event.signups.find((s: any) => s.userId === $formData.userId)?.user
        .name,
      value: $formData.userId,
      user: event.signups.find((s: any) => s.userId === $formData.userId)?.user,
    } || undefined;
</script>

<form method="POST" action="?/createAssignment">
  <div class="grid gap-4 max-w-lg">
    <Form.Field {form} name="position">
      <Form.Control let:attrs>
        <Form.Label>Assigned position</Form.Label>
        <Select.Root
          selected={selectedPosition}
          onSelectedChange={(v) => {
            v && ($formData.position = _as(v.value));
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
        <input type="hidden" bind:value={$formData.position} name="position" />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="userId">
      <Form.Control let:attrs>
        <Form.Label>Member</Form.Label>
        <Select.Root
          selected={selectedUser}
          onSelectedChange={(v) => {
            v && ($formData.userId = _as(v.value));
          }}>
          <Select.Trigger {...attrs}>
            <Select.Value placeholder="Select member" />
          </Select.Trigger>
          <Select.Content>
            {#each event.signups as signup (signup)}
              <Select.Item value={signup.user.id}>
                {signup.user.name} - {signup.user.id} ({signup.user
                  .ratingShort})
              </Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
        <input type="hidden" bind:value={$formData.userId} name="userId" />
      </Form.Control>
      <Form.Description>
        You can only select members who have signed up for this event.
      </Form.Description>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Button class="ml-auto">Create</Form.Button>
  </div>
</form>
