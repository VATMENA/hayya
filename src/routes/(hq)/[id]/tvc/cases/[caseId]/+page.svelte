<script lang="ts">
  import type { PageData } from "./$types";
  // @formatter:off
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog";
  // @formatter:on
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  import { ClockIcon } from "lucide-svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import Markdown from "$lib/components/Markdown.svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import TimelineItem from "./TimelineItem.svelte";
  import { can } from "$lib/perms/can";
  import { MANAGE_TV_REQUESTS } from "$lib/perms/permissions";
  import { toast } from "svelte-sonner";
  import { invalidateAll } from "$app/navigation";

  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
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

  let comment: string;

  async function addComment() {
    let data = new URLSearchParams();
    data.set("comment", comment);
    await fetch("?/addComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data.toString(),
    });
    toast.success("Commented successfully!");
    await invalidateAll();
  }

  let updStatusOpen = false;
  async function _setStatus(to: string) {
    let data = new URLSearchParams();
    data.set("to", to);
    await fetch("?/setStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data.toString(),
    });
    updStatusOpen = false;
    toast.success("Status updated successfully!");
    await invalidateAll();
  }
  function setStatus(to: string) {
    return () => {
      _setStatus(to);
    };
  }

  let tConfirmOpen = false;
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">Case #{data.tvCase.id}</h2>
</div>

<div class="grid grid-cols-4 gap-4">
  <div class="col-span-3 space-y-2">
    <Card.Root>
      <Card.Header>
        <Card.Title>History</Card.Title>
      </Card.Header>
      <Card.Content>
        {#each data.events as event}
          <TimelineItem type={event.type}>
            <!-- Generate the header -->
            <p slot="header">
              {#if event.type === "createCase"}
                <b>{event.user}</b>
                submitted the application
                <span class="text-foreground/80">
                  {formatTimeAgo(event.time)}
                </span>
              {:else if event.type === "comment"}
                <b>{event.user}</b>
                <span class="text-foreground/80">
                  commented {formatTimeAgo(event.time)}
                </span>
              {:else if event.type === "stateChange" && event.data}
                <b>{event.user}</b>
                changed the status to
                <b>
                  {#if event.data.to === "Pending"}
                    Pending
                  {:else if event.data.to === "InReview"}
                    In Review
                  {:else if event.data.to === "AdditionalInformationNeeded"}
                    Info Needed
                  {:else if event.data.to === "Accepted"}
                    Approved
                  {:else if event.data.to === "Rejected"}
                    Rejected
                  {/if}
                </b>
                <span class="text-foreground/80">
                  {formatTimeAgo(event.time)}
                </span>
              {/if}
            </p>

            <!-- Generate the content, if any -->
            <span slot="content">
              {#if event.type === "comment"}
                {#if event.data && event.data.content}
                  <div
                    class="rounded border px-4 py-2 leading-7 [&:not(:first-child)]:mt-6">
                    <Markdown src={event.data.content} />
                  </div>
                {/if}
              {/if}
            </span>
          </TimelineItem>
        {/each}
      </Card.Content>
    </Card.Root>

    {#if !(data.tvCase.caseState === "Rejected" || data.tvCase.caseState === "Accepted")}
      <Card.Root>
        <Card.Header>
          <Card.Title>Comment</Card.Title>
        </Card.Header>
        <Card.Content>
          <div class="h-min">
            <Textarea
              bind:value={comment}
              class="resize-none"
              placeholder="Enter your comment here. You can use Markdown to add links and styles." />
            <Button on:click={addComment} class="mt-2">Add Comment</Button>
          </div>
        </Card.Content>
      </Card.Root>
    {/if}

    <!--
    <Card.Root>
      <Card.Header>
        <Card.Title>Comment</Card.Title>
      </Card.Header>
      <Card.Content>
        {#if data.tvCase.caseState === "Rejected" || data.tvCase.caseState === "Accepted"}
          <Textarea disabled
            class="resize-none"
            placeholder="This case is closed. It must be reopened before you can add a comment." />
        {:else}

        {/if}
      </Card.Content>
    </Card.Root>
    -->
  </div>

  <div class="space-y-4">
    <Card.Root>
      <Card.Header
        class="my-0 flex flex-row items-center justify-between pb-2 pt-3">
        <Card.Title>Case Type</Card.Title>
      </Card.Header>
      <Card.Content>
        <p class="my-0 text-2xl font-bold">{data.tvCase.caseType}</p>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header
        class="my-0 flex flex-row items-center justify-between pb-2 pt-3">
        <Card.Title>Status</Card.Title>
        {#if can(MANAGE_TV_REQUESTS)}
          <Dialog.Root bind:open={updStatusOpen}>
            <Dialog.Trigger class={buttonVariants({})}>Update</Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Change Status</Dialog.Title>
              </Dialog.Header>

              <div class="grid grid-cols-3 gap-4">
                <Button on:click={setStatus("pending")} variant="secondary">
                  Pending
                </Button>
                <Button on:click={setStatus("inReview")}>In Review</Button>
                <Button
                  on:click={setStatus("infoNeeded")}
                  class="bg-yellow-500 hover:bg-yellow-600">
                  Info Needed
                </Button>
              </div>

              <div class="grid grid-cols-2 gap-4">
                {#if data.tvCase.caseType === "Transfer"}
                  <Button
                    on:click={() => {
                      tConfirmOpen = true;
                    }}
                    class="bg-green-500 hover:bg-green-600">
                    Accept
                  </Button>
                {:else}
                  <Button
                    on:click={setStatus("accept")}
                    class="bg-green-500 hover:bg-green-600">
                    Accept
                  </Button>
                {/if}
                <Button on:click={setStatus("reject")} variant="destructive">
                  Reject
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        {/if}
      </Card.Header>
      <Card.Content>
        <p class="my-0 text-2xl font-bold">
          {#if data.tvCase.caseState === "Pending"}
            Pending
          {:else if data.tvCase.caseState === "InReview"}
            In Review
          {:else if data.tvCase.caseState === "AdditionalInformationNeeded"}
            Info Needed
          {:else if data.tvCase.caseState === "Accepted"}
            Approved
          {:else if data.tvCase.caseState === "Rejected"}
            Rejected
          {/if}
        </p>
      </Card.Content>
    </Card.Root>

    {#if can(MANAGE_TV_REQUESTS)}
      <Card.Root>
        <Card.Header
          class="my-0 flex flex-row items-center justify-between pb-2 pt-3">
          <Card.Title>Submitter CID</Card.Title>
        </Card.Header>
        <Card.Content>
          <p class="my-0 text-2xl font-bold">{data.tvCase.userId}</p>
        </Card.Content>
      </Card.Root>
    {/if}
  </div>
</div>

<Dialog.Root bind:open={tConfirmOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Accept Transfer</Dialog.Title>
      <Dialog.Description>
        In order to accept a transfer request, you must transfer the user via
        the transfer request system on staff.vatsim.me.
      </Dialog.Description>
    </Dialog.Header>
    <h3>Has the user already been transferred?</h3>
    <Button
      on:click={() => {
        _setStatus("accept");
        tConfirmOpen = false;
      }}
      class="bg-green-500 hover:bg-green-600">
      Yes, they've been transferred
    </Button>
    <Button
      href="https://staff.vatsim.me/dashboard/transfers"
      target="_blank"
      variant="destructive">
      No, I need to submit a transfer request
    </Button>
  </Dialog.Content>
</Dialog.Root>
