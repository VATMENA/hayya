<script lang="ts">
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import { formSchema, type FormSchema } from "./schema";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  // @formatter:off
  import * as Form from "$lib/components/ui/form";
  import * as Select from "$lib/components/ui/select";
  // @formatter:on
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  export let data: SuperValidated<Infer<FormSchema>>;

  const form = superForm(data, {
    validators: zodClient(formSchema),
    onUpdated({ form }) {
      if (form.valid) {
        toast.success("Visiting application submitted successfully!");
        goto("/tvc");
      }
    },
  });

  const { form: formData, enhance, delayed } = form;

  let facilities: Map<string, string> = new Map();
  for (let facility of $page.data.facilities) {
    facilities.set(facility.id, facility.name);
  }

  $: selectedFacility = $formData.facilityId
    ? {
        label: facilities.get($formData.facilityId)!,
        value: $formData.facilityId,
      }
    : undefined;
  $: console.log($formData.facilityId, selectedFacility);
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="facilityId">
    <Form.Control let:attrs>
      <Form.Label>Facility</Form.Label>
      <Select.Root
        selected={selectedFacility}
        onSelectedChange={(v) => {
          v && ($formData.facilityId = v.value);
        }}>
        <Select.Trigger {...attrs}>
          <Select.Value placeholder="Select a facility to apply to" />
        </Select.Trigger>
        <Select.Content>
          {#each $page.data.facilities as facility}
            <Select.Item value={facility.id} label={facility.name} />
          {/each}
        </Select.Content>
      </Select.Root>
      <input hidden bind:value={$formData.facilityId} name={attrs.name} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
</form>
