<script lang="ts">
  import { page } from "$app/stores";
  import {
    type DateValue,
    DateFormatter,
    getLocalTimeZone,
    parseDate,
    CalendarDate,
    today,
    toCalendarDateTime,
  } from "@internationalized/date";
  import { cn } from "$lib/utils";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { Calendar } from "$lib/components/ui/calendar";
  import * as Popover from "$lib/components/ui/popover";
  import * as Form from "$lib/components/ui/form";
  import type { SuperValidated } from "sveltekit-superforms";
  import { superForm } from "sveltekit-superforms/client";
  import { getForm } from "formsnap";
  import { CalendarIcon } from "lucide-svelte";

  export let config: any;

  const { form } = getForm();

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  });

  let value: DateValue | undefined = $form.date
    ? parseDate($form.date)
    : undefined;

  let placeholder: DateValue = today(getLocalTimeZone());
</script>

<Form.Field {config} name="dateStart">
  <Form.Item class="flex flex-col">
    <Form.Label for="dateStart">Starting on...</Form.Label>
    <Popover.Root>
      <Form.Control id="dateStart" let:attrs>
        <Popover.Trigger
          id="dateStart"
          {...attrs}
          class={cn(
            buttonVariants({ variant: "outline" }),
            "pl-3 justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}>
          {value
            ? df.format(value.toDate(getLocalTimeZone()))
            : "Select a date"}
          <CalendarIcon class="ml-auto opacity-50 h-4 w-4" />
        </Popover.Trigger>
      </Form.Control>
      <Popover.Content class="w-auto p-0" side="top">
        <Calendar
          bind:value
          bind:placeholder
          minValue={today(getLocalTimeZone())}
          calendarLabel="Starting on..."
          initialFocus
          onValueChange={(v) => {
            if (v) {
              $form.dateStart = toCalendarDateTime(v).toString() + "Z";
            } else {
              $form.dateStart = "";
            }
          }} />
      </Popover.Content>
    </Popover.Root>
    <Form.Validation />
  </Form.Item>
</Form.Field>
