<script lang="ts">
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import { formSchema, type FormSchema } from "./schema";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  // @formatter:off
  import * as Form from "$lib/components/ui/form";
  // @formatter:on
  import { Input } from "$lib/components/ui/input";
  import { LoaderCircle } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  export let data: SuperValidated<Infer<FormSchema>>;

  const form = superForm(data, {
    validators: zodClient(formSchema),
    onUpdated({ form }) {
      if (form.valid) {
        toast.success("Facility updated successfully!");
        goto(`/${$page.params.id}/manage`);
      }
    },
  });

  const { form: formData, enhance, delayed } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="name">
    <Form.Control let:attrs>
      <Form.Label>vACC Name</Form.Label>
      <Input {...attrs} bind:value={$formData.name} />
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="website">
    <Form.Control let:attrs>
      <Form.Label>vACC Name</Form.Label>
      <Input {...attrs} bind:value={$formData.website} />
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="contact_email">
    <Form.Control let:attrs>
      <Form.Label>Contact Email</Form.Label>
      <Input {...attrs} bind:value={$formData.contact_email} />
    </Form.Control>
    <Form.Description>
      An email that can be used for direct inquiries to vACC staff.
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Button class="w-full">
    {#if $delayed}
      <LoaderCircle class="animate-spin w-5 h-5" />
    {:else}
      Save Changes
    {/if}
  </Form.Button>
</form>
