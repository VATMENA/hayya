<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion";
  import * as Alert from "$lib/components/ui/alert";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Info } from "lucide-svelte";
  import type { PageData } from "./$types";
  import { Button } from "$lib/components/ui/button";
  import { can } from "$lib/perms/can";
  import { MANAGE_EVENTS } from "$lib/perms/permissions";
  import { goto } from "$app/navigation";
  import SignupForm from "./signup-form.svelte";
  import { toast } from "svelte-sonner";

  export let data: PageData;

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });

  $: signupOpen = false;
</script>

<div class="mx-auto max-w-5xl">
  <div class="flex items-center">
    <img
      src={data.event?.bannerUrl}
      class="w-[30vw] rounded-md"
      alt={`${data.event?.name} event banner`} />
    <div class="flex flex-col space-y-3 ml-6">
      <p class="text-3xl font-bold">{data.event?.name}</p>
      <p>{data.event?.description}</p>
      <p class="font-bold">
        {#if data.event?.start.getDate() === data.event?.end.getDate()}
          {formatter.format(data.event?.start).replace(" at", "")}z - {data.event?.end.getUTCHours()}:{data.event?.end.getUTCMinutes()}z
        {:else}
          {formatter.format(data.event?.start).replace(" at", "")}z - {formatter
            .format(data.event?.end)
            .replace(" at", "")}z
        {/if}
      </p>
      <div>
        {#if !data.signup}
          <Button on:click={() => (signupOpen = true)}>Sign up!</Button>
        {:else}
          <p class="mb-3">
            You have signed up for <b>
              {data.signup.desiredPosition}
            </b>
          </p>
          <form method="POST" action="?/cancelSignup">
            <Button type="submit" variant="destructive" class="mb-2">
              Cancel signup
            </Button>
          </form>
        {/if}
        {#if can(MANAGE_EVENTS)}
          <Button
            variant="outline"
            on:click={() =>
              goto(`/${data.event?.hostId}/events/${data.event?.id}/edit`)}>
            Configure event
          </Button>
          <Button
            variant="outline"
            on:click={() =>
              goto(`/${data.event?.hostId}/events/${data.event?.id}/signups`)}>
            Manage signups
          </Button>
        {/if}
      </div>
    </div>
  </div>
  <Accordion.Root>
    <Accordion.Item value="item-1">
      <Accordion.Trigger>Event briefing</Accordion.Trigger>
      <Accordion.Content>
        <Alert.Root class="flex items-center space-x-2">
          <Info />
          <div>
            <Alert.Title>Feature coming soon!</Alert.Title>
            <Alert.Description>
              This feature is under development. Check back here soon!
            </Alert.Description>
          </div>
        </Alert.Root>
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-2">
      <Accordion.Trigger>Charts and scenery</Accordion.Trigger>
      <Accordion.Content>
        <Alert.Root class="flex items-center space-x-2">
          <Info />
          <div>
            <Alert.Title>Feature coming soon!</Alert.Title>
            <Alert.Description>
              This feature is under development. Check back here soon!
            </Alert.Description>
          </div>
        </Alert.Root>
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-3">
      <Accordion.Trigger>Roster</Accordion.Trigger>
      <Accordion.Content>
        {#if data.event?.positions && data.event?.positions.length > 0}
          <p class="font-bold">Positions to be rostered:</p>
          <ul>
            {#each data.event?.positions as position (position)}
              <li>{position}</li>
            {/each}
          </ul>
        {:else}
          <p class="font-bold">No positions to be rostered for this event!</p>
        {/if}
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</div>

<Dialog.Root bind:open={signupOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Sign up for {data.event?.name}</Dialog.Title>
      <Dialog.Description>
        Sign up to control during the {data.event?.name} event. Choose a position
        and indicate your availability below.
      </Dialog.Description>
    </Dialog.Header>
    <SignupForm
      data={data.signupForm}
      event={data.event}
      onSubmit={() => {
        signupOpen = false;
        toast.success(`Successfully signed up for ${data.event?.name}!`);
      }} />
  </Dialog.Content>
</Dialog.Root>
