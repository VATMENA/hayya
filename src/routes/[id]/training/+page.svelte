<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Progress } from "$lib/components/ui/progress";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import GiftIcon from "lucide-svelte/icons/gift";
  import LogInIcon from "lucide-svelte/icons/log-in";
  import LogOutIcon from "lucide-svelte/icons/log-out";
  import PlusIcon from "lucide-svelte/icons/plus";
  import ScrollTextIcon from "lucide-svelte/icons/scroll-text";
  import SettingsIcon from "lucide-svelte/icons/settings";
  import { can } from "$lib/perms/can";
  import { page } from "$app/stores";
  import * as Dialog from "$lib/components/ui/dialog";
  import type { PageData } from "./$types";
  import { Label } from "$lib/components/ui/label";
  import { Input } from "$lib/components/ui/input";
  import SessionForm from "./session-form.svelte";
  import { toast } from "svelte-sonner";
  import {
    MANAGE_QUEUES,
    RECOMMEND_FOR_QUEUE,
    TRAIN,
  } from "$lib/perms/permissions";
  import RequestForm from "./request-form.svelte";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { onMount } from "svelte";

  export let data: PageData;
  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addPage($page.data.url, "Training");
  }

  let sessionOpen = false;
  let viewTranscriptId = "";

  let requestTrainingOpen = false;

  onMount(() => {
    if (data.queue && !data.position) {
      toast.error(
        "There was a problem retrieving your position in the queue. Please try again later.",
      );
    }
  });
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">Training</h2>
</div>

<div class="flex grid-cols-3 flex-col gap-4 md:grid">
  <div class="space-y-4">
    <Card.Root>
      <Card.Header>
        <Card.Title>Training Queues</Card.Title>
      </Card.Header>
      <Card.Content class="space-y-2">
        {#if data.queue}
          <p>
            Enrolled in the <b>{data.queue.name}</b>
            queue.
          </p>
          {#if data.position}
            <p>
              You are number <b>{data.position}</b>
              in the queue.
            </p>
          {/if}
          <Button
            href="/{$page.params.id}/training/queues/{data.queue.id}/leave">
            <LogOutIcon class="mr-2 h-4 w-4" />
            Leave
          </Button>
        {:else}
          <p>Not currently a member of any queue.</p>
          <Button href="/{$page.params.id}/training/queues">
            <LogInIcon class="mr-2 h-4 w-4" />
            Join A Queue
          </Button>
        {/if}
        {#if can(MANAGE_QUEUES) || can(RECOMMEND_FOR_QUEUE)}
          <Button href="/{$page.params.id}/training/queues">
            <SettingsIcon class="mr-2 h-4 w-4" />
            Manage Queues
          </Button>
        {/if}
      </Card.Content>
    </Card.Root>
    <Card.Root>
      <Card.Header>
        <Card.Title>Request Training</Card.Title>
      </Card.Header>
      <Card.Content class="space-y-2">
        <Button
          on:click={() => {
            requestTrainingOpen = true;
          }}>
          <GiftIcon class="mr-2 h-4 w-4" />
          Request Training
        </Button>
        {#if can(TRAIN)}
          <Button href="/{$page.params.id}/training/requests">
            <SettingsIcon class="mr-2 h-4 w-4" />
            Manage Requests
          </Button>
        {/if}
      </Card.Content>
    </Card.Root>
  </div>
  <div class="space-y-4">
    <Card.Root>
      <Card.Header>
        <Card.Title>My Transcript</Card.Title>
      </Card.Header>
      <Card.Content class="space-y-1.5">
        <Button
          href="/{$page.params.id}/training/transcript/{$page.data.user.id}">
          <ScrollTextIcon class="mr-2 h-4 w-4" />
          My Training Transcript
        </Button>
      </Card.Content>
    </Card.Root>
    {#if can(TRAIN)}
      <Card.Root>
        <Card.Header>
          <Card.Title>Mentorship</Card.Title>
        </Card.Header>
        <Card.Content class="space-y-1.5">
          <Button
            on:click={() => {
              sessionOpen = true;
            }}>
            <PlusIcon class="mr-2 h-4 w-4" />
            Log Session
          </Button>

          <Dialog.Root>
            <Dialog.Trigger class={buttonVariants()}>
              <ScrollTextIcon class="mr-2 h-4 w-4" />
              Open a Student's Transcript
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>View Student Transcript</Dialog.Title>
                <Dialog.Description>
                  This transcript contains <i>all training data ever</i>
                  for this student in this vACC. This information should be considered
                  confidential.
                </Dialog.Description>
              </Dialog.Header>
              <div class="grid gap-4 py-4">
                <Label for="cid">CID</Label>
                <Input
                  bind:value={viewTranscriptId}
                  id="cid"
                  placeholder="1710004"
                  class="col-span-2" />
              </div>
              <Dialog.Footer>
                <Button
                  href="/{$page.params
                    .id}/training/transcript/{viewTranscriptId}">
                  View Transcript
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </Card.Content>
      </Card.Root>
    {/if}
  </div>
</div>

{#if can(TRAIN)}
  <Dialog.Root bind:open={sessionOpen}>
    <Dialog.Content class="max-w-[50vw]">
      <Dialog.Header>
        <Dialog.Title>Log Training Session</Dialog.Title>
      </Dialog.Header>
      <SessionForm
        data={data.form}
        onsubmit={() => {
          sessionOpen = false;
          toast.success("Session has been saved to the student's transcript");
        }} />
    </Dialog.Content>
  </Dialog.Root>
{/if}

<Dialog.Root bind:open={requestTrainingOpen}>
  <Dialog.Content class="max-w-[50vw]">
    <Dialog.Header>
      <Dialog.Title>Request Training Session</Dialog.Title>
    </Dialog.Header>
    <RequestForm
      data={data.requestForm}
      onsubmit={() => {
        requestTrainingOpen = false;
        toast.success("Training request submitted!");
      }} />
  </Dialog.Content>
</Dialog.Root>
