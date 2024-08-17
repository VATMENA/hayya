<script lang="ts">
  import type { PageData } from "./$types";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  import { writable } from "svelte/store";
  import {
    createRender,
    createTable,
    Render,
    Subscribe,
  } from "svelte-headless-table";
  import * as Table from "$lib/components/ui/table";
  import { humanReadableDate, relativeTime } from "$lib/date";
  import Button from "../../../../../../lib/components/ui/button/button.svelte";
  import { CheckIcon, ClockIcon, EyeIcon, XIcon } from "lucide-svelte";
  import { Badge } from "$lib/components/ui/badge";
  import { ScrollArea } from "$lib/components/ui/scroll-area";

  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addItem($page.data.url, `/${data.facility.id}/training`, "Training");
    addPage($page.data.url, `${data.student!.name}'s Transcript`);
  }
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">
    {data.student ? data.student.name : ""}'s Transcript
  </h2>
</div>

<div class="rounded-md border">
  {#if data.sessions.length === 0}
    <p>The student has not had any sessions yet.</p>
  {:else}
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Type</Table.Head>
          <Table.Head>Date</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Mentor</Table.Head>
          <Table.Head>Actions</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each data.sessions.toReversed() as session}
          <Table.Row>
            <Table.Cell>{session.plan.name}</Table.Cell>
            <Table.Cell>{humanReadableDate(session.scheduledTime)}</Table.Cell>
            <Table.Cell>
              {#if session.status === "Scheduled"}
                <Badge>
                  <ClockIcon class="mr-2 h-4 w-4" />
                  Scheduled
                </Badge>
              {:else if session.status === "Incomplete"}
                <Badge class="bg-yellow-300">
                  <XIcon class="mr-2 h-4 w-4" />
                  Incomplete
                </Badge>
              {:else if session.status === "Complete"}
                <Badge class="bg-green-400">
                  <CheckIcon class="mr-2 h-4 w-4" />
                  Complete
                </Badge>
              {/if}
            </Table.Cell>
            <Table.Cell>{session.mentor.name}</Table.Cell>
            <Table.Cell>
              <Button href="/{$page.params.id}/training/{session.id}">
                <EyeIcon class="mr-2 h-4 w-4" />
                View/Modify
              </Button>
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  {/if}
</div>
