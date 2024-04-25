<script lang="ts">
  import type { PageData } from "./$types";
  // @formatter:off
  import * as Card from "$lib/components/ui/card";
  // @formatter:on
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  import { ClockIcon } from "lucide-svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import Markdown from "$lib/components/Markdown.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea/index.js";

  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}/tvc`, "Transfer & Visiting");
    addPage($page.data.url, `Case #${data.tvCase.id}`);
  }

  const formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
  });

  const DIVISIONS = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" },
  ];

  function formatTimeAgo(date: Date) {
    let duration = (date.getTime() - new Date().getTime()) / 1000;

    for (let i = 0; i < DIVISIONS.length; i++) {
      const division = DIVISIONS[i];
      if (Math.abs(duration) < division.amount) {
        return formatter.format(
          Math.round(duration),
          <
            | "year"
            | "years"
            | "quarter"
            | "quarters"
            | "month"
            | "months"
            | "week"
            | "weeks"
            | "day"
            | "days"
            | "hour"
            | "hours"
            | "minute"
            | "minutes"
            | "second"
            | "seconds"
          >division.name,
        );
      }
      duration /= division.amount;
    }
  }
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">Case #{data.tvCase.id}</h2>
</div>

<div class="grid grid-cols-4 gap-4 overflow-hidden">
  <div class="col-span-3 grid grid-rows-8 gap-4">
    <Card.Root class="row-span-2">
      <Card.Header>
        <Card.Title>History</Card.Title>
      </Card.Header>
      <Card.Content>
        <ScrollArea>
          {#each data.events as event}
            {#if event.type === "createCase"}
              <p>
                <b>{event.user}</b>
                submitted the application
                <span class="text-foreground/80">
                  {formatTimeAgo(event.time)}
                </span>
              </p>
            {:else if event.type === "comment"}
              <p>
                <b>{event.user}</b>
                <span class="text-foreground/80">
                  commented {formatTimeAgo(event.time)}
                </span>
              </p>
              {#if event.data && event.data.content}
                <Markdown src={event.data.content} />
              {/if}
            {/if}
          {/each}
        </ScrollArea>
      </Card.Content>
    </Card.Root>
    <Card.Root>
      <Card.Header>
        <Card.Title>Comment</Card.Title>
      </Card.Header>
      <Card.Content>
        <Textarea
          class="resize-none"
          placeholder="Enter your comment here. You can use Markdown to add links and styles." />
        <Button class="my-2 float-right">Add Comment</Button>
      </Card.Content>
    </Card.Root>
  </div>

  <div>
    <Card.Root>
      <Card.Header
        class="flex flex-row items-center pt-3 pb-2 my-0 justify-between">
        <Card.Title>Status</Card.Title>
        <Button>Update</Button>
      </Card.Header>
      <Card.Content>
        <p class="text-2xl font-bold my-0">Information Needed</p>
      </Card.Content>
    </Card.Root>
  </div>
</div>
