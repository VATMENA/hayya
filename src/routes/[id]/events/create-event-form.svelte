<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { formSchema, type FormSchema } from "./schema";
  import type { SuperValidated } from "sveltekit-superforms";
  import DatePicker from "./date-picker.svelte";
  import Loader2Icon from "lucide-svelte/icons/loader";

  export let form: SuperValidated<FormSchema>;

  export let onsubmit: any;
  let loading: boolean = false;

  let options = {
    onSubmit: () => {
      loading = true;
    },
    onResult: () => {
      loading = false;
    },
    onUpdated: ({ form }) => {
      if (form.valid) {
        onsubmit();
      }
    },
  };
</script>

<Form.Root
  method="POST"
  action="?/create"
  {form}
  schema={formSchema}
  {options}
  let:config>
  <div class="space-y-2">
    <Form.Field {config} name="name">
      <Form.Item class="flex flex-col">
        <Form.Label>Event Name</Form.Label>
        <Form.Input />
        <Form.Validation />
      </Form.Item>
    </Form.Field>
    <div class="grid grid-cols-2 gap-4">
      <DatePicker name="startDate" label="Start Date" {config} />
      <Form.Field {config} name="startTime">
        <Form.Item class="flex flex-col">
          <Form.Label>Start Time (UTC, HHMM)</Form.Label>
          <Form.Input type="number" min={0} max={2359} />
          <Form.Validation />
        </Form.Item>
      </Form.Field>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <DatePicker name="endDate" label="End Date" {config} />
      <Form.Field {config} name="endTime">
        <Form.Item class="flex flex-col">
          <Form.Label>End Time (UTC, HHMM)</Form.Label>
          <Form.Input />
          <Form.Validation />
        </Form.Item>
      </Form.Field>
    </div>
    <Form.Field {config} name="description">
      <Form.Item class="flex flex-col">
        <Form.Label>Event Description</Form.Label>
        <Form.Textarea
          placeholder="This is a very cool event!"
          class="resize-none" />
        <Form.Description>
          You can use Markdown to add links and styles.
        </Form.Description>
        <Form.Validation />
      </Form.Item>
    </Form.Field>
    <Form.Field {config} name="bannerUrl">
      <Form.Item class="flex flex-col">
        <Form.Label>Banner Image URL</Form.Label>
        <Form.Input />
        <Form.Description>
          Very large images may take a few moments to process.
        </Form.Description>
        <Form.Validation />
      </Form.Item>
    </Form.Field>
    <Form.Button class="float-right w-[9vw]">
      {#if loading}
        <Loader2Icon class="w-4 h-4 animate-spin" />
      {:else}
        Create Event
      {/if}
    </Form.Button>
  </div>
</Form.Root>
