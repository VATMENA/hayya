<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { formSchema, type FormSchema } from "./session-form";
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import DatePicker from "$lib/components/DatePicker.svelte";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { LoaderCircle } from "lucide-svelte";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";

  export let data: SuperValidated<Infer<FormSchema>>;
  export let onsubmit: any;

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

<form method="POST" action="?/logSession" use:enhance>
  <div class="space-y-4">
    <div class="grid-cols-3 grid gap-4">
      <Form.Field {form} name="cid" class="flex flex-col">
        <Form.Control let:attrs>
          <Form.Label>CID</Form.Label>
          <Input {...attrs} bind:value={$formData.cid} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="date" class="flex flex-col">
        <Form.Control let:attrs>
          <Form.Label>Session date</Form.Label>
          <DatePicker name="date" form={formData} {attrs} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="sessionType" class="flex flex-col">
        <Form.Control let:attrs>
          <Form.Label>Session Type</Form.Label>
          <Input {...attrs} bind:value={$formData.sessionType} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <Form.Field {form} name="studentComments" class="flex flex-col">
        <Form.Control let:attrs>
          <Form.Label>Student Comments</Form.Label>
          <Textarea
            class="resize-none"
            {...attrs}
            bind:value={$formData.studentComments} />
          <Form.Description class="text-xs">
            Insert rich text with <a
              class="underline underline-offset-4"
              href="https://commonmark.org/help/">
              Markdown
            </a>
          </Form.Description>
        </Form.Control>
        <Form.Description>
          These comments will be visible to the student and other mentors.
        </Form.Description>
      </Form.Field>
      <Form.Field {form} name="mentorComments" class="flex flex-col">
        <Form.Control let:attrs>
          <Form.Label>Student Comments</Form.Label>
          <Textarea
            class="resize-none"
            {...attrs}
            bind:value={$formData.mentorComments}></Textarea>
          <Form.Description class="text-xs">
            Insert rich text with <a
              class="underline underline-offset-4"
              href="https://commonmark.org/help/">
              Markdown
            </a>
          </Form.Description>
        </Form.Control>
        <Form.Description>
          These comments will be visible only for other mentors.
        </Form.Description>
      </Form.Field>
    </div>
    <Form.Button class="w-full">
      {#if $delayed}
        <LoaderCircle class="animate-spin w-5 h-5" />
      {:else}
        Log Session
      {/if}
    </Form.Button>
  </div>
</form>
<!--
<Form.Root
  method="POST"
  {options}
  {form}
  schema={formSchema}
  let:config
  action="?/logSession">
  <div class="space-y-4">
    <div class="grid-cols-3 grid gap-4">
      <Form.Field {config} name="cid">
        <Form.Item class="flex flex-col">
          <Form.Label>CID</Form.Label>
          <Form.Input />
          <Form.Validation />
        </Form.Item>
      </Form.Field>
      <DatePicker {config} />
      <Form.Field {config} name="sessionType">
        <Form.Item class="flex flex-col">
          <Form.Label>Session Type</Form.Label>
          <Form.Input />
          <Form.Validation />
        </Form.Item>
      </Form.Field>
    </div>
    <div class="grid-cols-2 grid gap-4">
      <Form.Field {config} name="studentComments">
        <Form.Item class="flex flex-col">
          <Form.Label>Student Comments</Form.Label>
          <Form.Textarea
            placeholder="You did well at... and you could improve on..."
            class="resize-none" />
          <Form.Description>
            These comments will be visible to the student and other mentors. You
            can use Markdown to add links and styles.
          </Form.Description>
          <Form.Validation />
        </Form.Item>
      </Form.Field>
      <Form.Field {config} name="mentorComments">
        <Form.Item class="flex flex-col">
          <Form.Label>Mentor Comments</Form.Label>
          <Form.Textarea
            placeholder="Needs more practice with unexpected explosions and unauthorized takeoffs"
            class="resize-none" />
          <Form.Description>
            These comments will be visible only to other mentors. You can use
            Markdown to add links and styles.
          </Form.Description>
          <Form.Validation />
        </Form.Item>
      </Form.Field>
    </div>
  </div>
  <Form.Button class="float-right">Log Session</Form.Button>
</Form.Root>
-->
