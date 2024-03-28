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
  import CalendarIcon from "lucide-svelte/icons/calendar";

  export let config: any;
  export let name: string;
  export let label: string;

  const { form } = getForm();

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  });

  let value: DateValue | undefined = $form[name]
    ? parseDate($form[name])
    : undefined;

  let placeholder: DateValue = today(getLocalTimeZone());
</script>

<Form.Field {config} {name}>
  <Form.Item class="flex flex-col">
    <Form.Label for={name}>{label}</Form.Label>
    <Popover.Root>
      <Form.Control id={name} let:attrs>
        <Popover.Trigger
          id={name}
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
          calendarLabel={label}
          initialFocus
          onValueChange={(v) => {
            if (v) {
              $form[name] = toCalendarDateTime(v).toString() + "Z";
            } else {
              $form[name] = "";
            }
          }} />
      </Popover.Content>
    </Popover.Root>
    <Form.Validation />
  </Form.Item>
</Form.Field>
