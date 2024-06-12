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

  let canManageEvents = can(MANAGE_EVENTS);

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
    class="w-full mr-4 mb-4 h-fit md:h-full transition hover:scale-[1.02]">
    <img
      src={event.bannerUrl}
      class="rounded-t-lg h-1/2 object-cover"
      alt={`${event.name} event banner`} />
    <Card.Header class="font-bold text-3xl py-3">{event.name}</Card.Header>
    <Card.Content>
      <!-- <div class="truncate">{event.description}</div> -->
    </Card.Content>
    <Card.Footer class="flex flex-col items-start">
      <div class="font-bold">
        {#if event.start.getDate() === event.end.getDate()}
          {formatter.format(event.start).replace(" at", "")}z - {event.end.getUTCHours()}:{event.end.getUTCMinutes()}z
        {:else}
          {formatter.format(event.start).replace(" at", "")}z - {formatter
            .format(event.end)
            .replace(" at", "")}z
        {/if}
      </div>
      <div>
        {#if canManageEvents}
          <div class="text-xs">
            Visibility (STAFF ONLY): <span class="font-bold">
              {event.public ? "Public" : "Private"}
            </span>
          </div>
        {/if}
      </div>
    </Card.Footer>
  </Card.Root>
</a>
