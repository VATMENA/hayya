<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { can } from "$lib/perms/can";
  import { MANAGE_EVENTS, MANAGE_QUEUES } from "$lib/perms/permissions";
  import type { Event } from "@prisma/client";
  import { PenBox, Trash2 } from "lucide-svelte";
  import type { PageData } from "./$types";

  export let event: Event;

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });
</script>

<a href={`/${event.hostId}/events/${event.id}`}>
  <Card.Root
    class="max-w-xs mr-4 mb-4 h-fit md:h-full transform transition-transform hover:scale-[1.02]">
    <img
      src={event.bannerUrl}
      class="rounded-t-lg h-1/2 object-cover"
      alt={`${event.name} event banner`} />
    <Card.Header class="font-bold text-lg py-3">{event.name}</Card.Header>
    <Card.Content class="flex grow">
      <p>{event.description}</p>
    </Card.Content>
    <Card.Footer class="font-bold mb-4 float-bottom">
      {#if event.start.getDate() === event.end.getDate()}
        {formatter.format(event.start).replace(" at", "")}z - {event.end.getUTCHours()}:{event.end.getUTCMinutes()}z
      {:else}
        {formatter.format(event.start).replace(" at", "")}z - {formatter
          .format(event.end)
          .replace(" at", "")}z
      {/if}
    </Card.Footer>
  </Card.Root>
</a>
