<script lang="ts">
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import { requestSchema, type RequestSchema } from "./requestSchema";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import * as Form from "$lib/components/ui/form";
  import * as Popover from "$lib/components/ui/popover";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { CalendarDate, DateFormatter, type DateValue, getLocalTimeZone, parseDate, today } from "@internationalized/date";
  import CalendarIcon from "lucide-svelte/icons/calendar";
  import { cn } from "$lib/utils";
  import { Calendar } from "$lib/components/ui/calendar";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
  import { XIcon } from "lucide-svelte";

  export let data: SuperValidated<Infer<RequestSchema>>;
  export let onsubmit: () => void;

  const form = superForm(data, {
    validators: zodClient(requestSchema),
    dataType: "json",
    async onUpdated({ form }) {
      if (form.valid) {
        onsubmit();
      }
    }
  });

  const { form: formData, enhance } = form;

  const df = new DateFormatter("en-US", {
    dateStyle: "long"
  });


  let placeholder: DateValue = today(getLocalTimeZone());
</script>

<form method="POST" use:enhance action="?/request">
  <Button
    on:click={() => {$formData.availability.push({ date: today(getLocalTimeZone()).toString(), start: { hour: 0, minute: 0}, end: { hour: 0, minute: 0 }}); $formData.availability = $formData.availability;}}>
    Add Availability
  </Button>
  {#each $formData.availability as avail, i}
    <div class="flex flex-row gap-4">
      <div class="flex-1">
      <Form.Field {form} name="availability[{i}].date" class="flex flex-col">
        <Form.Control let:attrs>
          <Form.Label>Date</Form.Label>
          <Popover.Root>
            <Popover.Trigger
              {...attrs}
              class={cn(
            buttonVariants({ variant: "outline" }),
            "max-w-full overflow-clip text-left",
            !($formData.availability[i].date) && "text-muted-foreground"
          )}
            >
              {$formData.availability[i].date}
              <CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
            </Popover.Trigger>
            <Popover.Content class="w-auto p-0" side="top">
              <Calendar
                value={parseDate($formData.availability[i].date)}
                minValue={today(getLocalTimeZone())}
                calendarLabel="Date of birth"
                initialFocus
                onValueChange={(v) => {
              if (v) {
                $formData.availability[i].date = v.toString();
              } else {
                $formData.availability[i].date = "";
              }
            }}
              />
            </Popover.Content>
          </Popover.Root>
          <Form.FieldErrors />
          <input hidden value={$formData.availability[i].date} name={attrs.name} />
        </Form.Control>
      </Form.Field>
      </div>

      <div class="flex-2">
        <div class="flex flex-row">
          <Form.Field {form} name="availability[{i}].start.hour" class="flex flex-col">
            <Form.Control let:attrs>
              <Form.Label>From</Form.Label>
              <Input {...attrs} type="number" min={0} max={23} bind:value={$formData.availability[i].start.hour} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <p class="mt-6 font-semibold text-lg">:</p>
          <Form.Field {form} name="availability[{i}].start.minute" class="flex flex-col">
            <Form.Control let:attrs>
              <Form.Label>(MM)</Form.Label>
              <Input {...attrs} type="number" bind:value={$formData.availability[i].start.minute} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <Form.Field {form} name="availability[{i}].end.hour" class="flex flex-col ml-2">
            <Form.Control let:attrs>
              <Form.Label>To</Form.Label>
              <Input {...attrs} type="number" bind:value={$formData.availability[i].end.hour} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <p class="mt-6 font-semibold text-lg">:</p>
          <Form.Field {form} name="availability[{i}].end.minute" class="flex flex-col">
            <Form.Control let:attrs>
              <Form.Label>(MM)</Form.Label>
              <Input {...attrs} type="number" bind:value={$formData.availability[i].end.minute} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <Button on:click={() => {$formData.availability.splice(i, 1); $formData.availability = $formData.availability;}} variant="ghost" class="mt-5 ml-2">
            <XIcon class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  {/each}

  <Form.Field {form} name="notes">
    <Form.Control let:attrs>
      <Form.Label>Notes</Form.Label>
      <Textarea {...attrs} bind:value={$formData.notes} />
    </Form.Control>
    <Form.Description>Any additional information you would want your mentor to know.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Button>Submit Request</Form.Button>
</form>