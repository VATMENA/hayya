<script lang="ts">
  import { page } from "$app/stores";
  import {
    type DateValue,
    DateFormatter,
    getLocalTimeZone,
    parseDate,
    CalendarDate,
    today,
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

  const { form } = getForm();

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  });

  let value: DateValue | undefined = $form.solo_expires
    ? parseDate($form.solo_expires)
    : undefined;

  let placeholder: DateValue = today(getLocalTimeZone());
</script>

<Form.Field {config} name="solo_expires">
  <Form.Item class="flex flex-col">
    <Form.Label for="solo_expires">Solo Expiry</Form.Label>
    <Popover.Root>
      <Form.Control id="solo_expires" let:attrs>
        <Popover.Trigger
          id="solo_expires"
          {...attrs}
          class={cn(
            buttonVariants({ variant: "outline" }),
            "pl-3 justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}>
          {value ? df.format(value.toDate(getLocalTimeZone())) : "Never"}
          <CalendarIcon class="ml-auto opacity-50 h-4 w-4" />
        </Popover.Trigger>
      </Form.Control>
      <Popover.Content class="w-auto p-0" side="top">
        <Calendar
          bind:value
          bind:placeholder
          minValue={today(getLocalTimeZone()).add({ days: 7 })}
          maxValue={today(getLocalTimeZone()).add({ days: 90 })}
          calendarLabel="Date of birth"
          initialFocus
          onValueChange={(v) => {
            if (v) {
              $form.solo_expires = v.toString();
            } else {
              $form.solo_expires = "";
            }
          }} />
      </Popover.Content>
    </Popover.Root>
    <Form.Description>
      Solo certificates can be 7 to 90 days in length per GCAP 7.3(c). Leave
      blank unless issuing a solo certificate.
    </Form.Description>
    <Form.Validation />
  </Form.Item>
</Form.Field>
