<script lang="ts">
  import CalendarIcon from "lucide-svelte/icons/calendar";
  import {
    type DateValue,
    DateFormatter,
    getLocalTimeZone,
    today,
    parseDateTime,
    toCalendarDate,
    parseAbsolute,
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { Calendar } from "$lib/components/ui/calendar";
  import * as Popover from "$lib/components/ui/popover";

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  });

  let value: DateValue | undefined;

  export let form;
  export let name: string;

  $: value = $form[name]
    ? toCalendarDate(parseAbsolute($form[name].toISOString(), "UTC"))
    : undefined;

  let clazz = "";
  // @ts-ignore
  export { clazz as class };

  export let calendarLabel = "Select a date";
  export let placeholderDate: DateValue = today(getLocalTimeZone());
  export let minValue: DateValue | undefined = undefined;
  export let maxValue: DateValue | undefined = undefined;
  export let attrs: any;
</script>

<Popover.Root>
  <Popover.Trigger
    {...attrs}
    class={cn(
      buttonVariants({ variant: "outline" }),
      `${clazz} justify-start pl-4 text-left font-normal`,
      !value && "text-muted-foreground",
    )}>
    {value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date"}
    <CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0" side="top">
    <Calendar
      {value}
      bind:placeholder={placeholderDate}
      {minValue}
      {maxValue}
      {calendarLabel}
      initialFocus
      onValueChange={(v) => {
        if (v) {
          $form[name] = new Date(v.toString());
        } else {
          $form[name] = undefined;
        }
      }} />
  </Popover.Content>
</Popover.Root>
<input type="hidden" {name} {value} />
