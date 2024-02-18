<script lang="ts">
  import type { PageData } from "./$types";
  import { Plus } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { can } from "$lib/perms/can";
  import * as Dialog from "$lib/components/ui/dialog";
  import CreateEventForm from "./create-event-form.svelte";
  import { toast } from "svelte-sonner";
  import * as Table from "$lib/components/ui/table";
  import Image from "$lib/components/Image.svelte";

  export let data: PageData;

  let createDialogOpen = false;
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Upcoming Events</h2>
  {#if can(data.roles, data.vacc_id, data.user.vaccId, `vacc.${data.vacc_id}.events.manage`)}
    <Button
      on:click={() => {
        createDialogOpen = true;
      }}>
      <Plus class="mr-2 w-4 h-4" />
      Create
    </Button>
  {/if}
</div>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Banner</Table.Head>
      <Table.Head>Name</Table.Head>
      <Table.Head>Time</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each data.events as event}
      <Table.Row>
        <Table.Cell>
          <Image
            width="480px"
            class="rounded"
            src={event.bannerUrl}
            blurhash={event.bannerBlurHash}
            style="aspect-ratio: 16/9;"
            alt="" />
        </Table.Cell>
        <Table.Cell>{event.name}</Table.Cell>
        <Table.Cell>{event.start} to {event.end}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>

{#if can(data.roles, data.vacc_id, data.user.vaccId, `vacc.${data.vacc_id}.events.manage`)}
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
