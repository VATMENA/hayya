<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { formSchema, type FormSchema } from "./revoke-form";
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { LoaderCircle } from "lucide-svelte";

  export let data: SuperValidated<Infer<FormSchema>>;
  export let onsubmit: any;
  export let id: number;

  const form = superForm(data, {
    validators: zodClient(formSchema),
    onUpdated({ form }) {
      if (form.valid) {
        onsubmit();
      }
    },
  });

  const { form: formData, enhance, delayed } = form;
</script>

<form method="POST" action="?/revokeCertificate" use:enhance>
  <input type="hidden" name="id" value={id} />
  <div class="space-y-4">
    <div class="grid-cols-2 grid gap-4">
      <Form.Field {form} name="studentComments">
        <Form.Control let:attrs>
          <Form.Label>Student Comments</Form.Label>
          <Textarea
            class="resize-none"
            {...attrs}
            bind:value={$formData.studentComments} />
        </Form.Control>
        <Form.Description>
          These comments will be visible to the student <b>and</b>
          other mentors. You can use Markdown to add links and styles.
        </Form.Description>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="mentorComments">
        <Form.Control let:attrs>
          <Form.Label>Mentor Comments</Form.Label>
          <Textarea
            class="resize-none"
            {...attrs}
            bind:value={$formData.mentorComments} />
        </Form.Control>
        <Form.Description>
          These comments will be visible only to other mentors. You can use
          Markdown to add links and styles.
        </Form.Description>
        <Form.FieldErrors />
      </Form.Field>
    </div>
  </div>
  <Form.Button class="w-full">
    {#if $delayed}
      <LoaderCircle class="animate-spin w-5 h-5" />
    {:else}
      Revoke
    {/if}
  </Form.Button>
</form>
