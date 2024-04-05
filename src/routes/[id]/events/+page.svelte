<script lang="ts">
  import type { PageData } from "./$types";
  import { MoreHorizontal, Plus } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { can } from "$lib/perms/can";
  import * as Carousel from "$lib/components/ui/carousel";
  import * as Dialog from "$lib/components/ui/dialog";
  import CreateEventForm from "./create-event-form.svelte";
  import { toast } from "svelte-sonner";
  import * as Table from "$lib/components/ui/table";
  import Image from "$lib/components/Image.svelte";
  import { humanReadableDate } from "$lib/date.js";
  import { page } from "$app/stores";
  import CertForm from "../roster/cert-form.svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { writable } from "svelte/store";
  import {
    createRender,
    createTable,
    Render,
    Subscribe,
  } from "svelte-headless-table";
  import DataTableBanner from "./data-table-banner.svelte";
  import DataTableActions from "./data-table-actions.svelte";
  import { MANAGE_EVENTS } from "$lib/perms/permissions";
  import EventCard from "./event-card.svelte";

  export let data: PageData;

  let createDialogOpen = false;

  let canManageEvents = can(MANAGE_EVENTS);

  let store = writable(data.events);
  $: $store = data.events;

  const table = createTable(store);

  const columns = table.createColumns([
    table.column({
      accessor: (i) => i,
      header: "Banner",
      cell: ({ value }) => {
        return createRender(DataTableBanner, {
          eventId: value.id,
          bannerUrl: value.bannerUrl,
          blurhash: value.bannerBlurHash,
        });
      },
    }),
    table.column({
      accessor: "name",
      header: "Name",
    }),
    table.column({
      accessor: "start",
      header: "Starts",
      cell: ({ value }) => {
        return humanReadableDate(value);
      },
    }),
    table.column({
      accessor: "end",
      header: "Ends",
      cell: ({ value }) => {
        return humanReadableDate(value);
      },
    }),
    table.column({
      accessor: (e) => e,
      header: "Actions",
      cell: ({ value }) => {
        return createRender(DataTableActions, {
          event: value,
          canManageEvents,
        });
      },
    }),
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns);
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Upcoming Events</h2>
  {#if canManageEvents}
    <Button
      on:click={() => {
        createDialogOpen = true;
      }}>
      <Plus class="mr-2 w-4 h-4" />
      Create
    </Button>
  {/if}
</div>

<Carousel.Root class="max-w-full mx-12">
  <Carousel.Content>
    {#each data.events as event (event.id)}
      {#if event.public}
        <Carousel.Item class="md:basis-1/2 lg:basis-1/4">
          <EventCard {event} />
        </Carousel.Item>
      {/if}
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>

{#if canManageEvents}
  <Table.Root {...$tableAttrs}>
    <Table.Header>
      {#each $headerRows as headerRow}
        <Subscribe rowAttrs={headerRow.attrs()}>
          <Table.Row>
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                <Table.Head {...attrs}>
                  <Render of={cell.render()} />
                </Table.Head>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Header>
    <Table.Body {...$tableBodyAttrs}>
      {#each $pageRows as row (row.id)}
        <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
          <Table.Row {...rowAttrs}>
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                <Table.Cell {...attrs}>
                  <Render of={cell.render()} />
                </Table.Cell>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Body>
  </Table.Root>
{/if}

<!--
<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-min">Banner</Table.Head>
      <Table.Head>Name</Table.Head>
      <Table.Head>Start</Table.Head>
      <Table.Head>End</Table.Head>
      {#if canManageEvents}
        <Table.Head>Actions</Table.Head>
      {/if}
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each data.events as event}
      {#if event.public || canManageEvents}
        <Table.Row>
          <Table.Cell>

          </Table.Cell>
          <Table.Cell>{event.name}</Table.Cell>
          <Table.Cell>{humanReadableDate(event.start)}</Table.Cell>
          <Table.Cell>{humanReadableDate(event.end)}</Table.Cell>
          {#if canManageEvents}

          {/if}
        </Table.Row>
      {/if}
    {/each}
  </Table.Body>
</Table.Root>
-->

{#if can(MANAGE_EVENTS)}
  <Dialog.Root bind:open={createDialogOpen}>
    <Dialog.Content>
      <Dialog.Title>Create event</Dialog.Title>
      <Dialog.Description>
        The new event will be private with signups disabled by default.
      </Dialog.Description>
      <CreateEventForm
        form={data.form}
        onsubmit={() => {
          createDialogOpen = false;
          toast.success("Event has been created!");
        }} />
    </Dialog.Content>
  </Dialog.Root>
{/if}
