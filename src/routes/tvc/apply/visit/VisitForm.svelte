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
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { LoaderCircle } from "lucide-svelte";

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

  {#if selectedFacility}
    <Form.Field {form} name="why">
      <Form.Control let:attrs>
        <Form.Label>
          Why do you want to visit {selectedFacility.label}?
        </Form.Label>
        <Textarea
          class="resize-none"
          bind:value={$formData.why}
          {...attrs}
          name="why" />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="whatPositions">
      <Form.Control let:attrs>
        <Form.Label>
          What controlling positions interest you within {selectedFacility.label}?
        </Form.Label>
        <Textarea
          class="resize-none"
          bind:value={$formData.whatPositions}
          {...attrs}
          name="whatPositions" />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="experience">
      <Form.Control let:attrs>
        <Form.Label>
          Do you have any relevant experience, on or off network, that you think
          may affect the outcome of your application?
        </Form.Label>
        <Textarea
          class="resize-none"
          bind:value={$formData.experience}
          {...attrs}
          name="experience" />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="anythingElse">
      <Form.Control let:attrs>
        <Form.Label>Do you have anything else to add?</Form.Label>
        <Textarea
          class="resize-none"
          bind:value={$formData.anythingElse}
          {...attrs}
          name="anythingElse" />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Button>
      {#if $delayed}
        <LoaderCircle class="h-5 w-5 animate-spin" />
      {:else}
        Submit Application
      {/if}
    </Form.Button>
  {/if}
</form>
