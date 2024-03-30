<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import type { PageData } from "./$types";
  import CircleCheck from "lucide-svelte/icons/circle-check";
  import CircleX from "lucide-svelte/icons/circle-x";

  export let data: PageData;
</script>

<div class="h-screen flex flex-col p-6 space-y-4 items-center justify-center">
  <Card.Root class="w-96 justify-center content-center">
    <Card.Header>
      <Card.Title>Apply to visit a facility within VATMENA</Card.Title>
      <Card.Description>
        You must meet the requirements below, as outlined by the VATSIM
        Transferring & Visiting Controller Policy, version 2.0, published 20
        March 2024. If you do not meet the requirements, you will not be
        permitted to visit within VATMENA.
      </Card.Description>

      <p>
        For an <b>{data.home === "EMEA/MENA" ? "internal" : "external"}</b>
        visiting request, the following requirements apply:
      </p>

      <ul class="space-y-2">
        <li class="flex">
          {#if data.home === "EMEA/MENA" && data.rating > 2}
            <CircleCheck class="text-green-500 min-w-6 min-h-6 mr-2" />
          {:else if data.rating > 3}
            <CircleCheck class="text-green-500 min-w-6 min-h-6 mr-2" />
          {:else}
            <CircleX class="text-red-500 min-w-6 min-h-6 mr-2" />
          {/if}
          <span class="text-foreground/90">
            You hold an {data.home === "EMEA/MENA" ? "S2" : "S3"} rating or higher
            ({data.ratingShort})
          </span>
        </li>
        <li class="flex">
          {#if data.fiftyHours}
            <CircleCheck class="text-green-500 min-w-6 min-h-6 mr-2" />
          {:else}
            <CircleX class="text-red-500 min-w-6 min-h-6 mr-2" />
          {/if}
          <span class="text-foreground/90">
            You have logged {(data.total_time / 60 / 60).toFixed(
              1,
            )}/{data.required / 60 / 60} hours since your last rating upgrade
          </span>
        </li>
        <li class="flex">
          {#if data.fiftyHours}
            <CircleCheck class="text-green-500 min-w-6 min-h-6 mr-2" />
          {:else}
            <CircleX class="text-red-500 min-w-6 min-h-6 mr-2" />
          {/if}
          <span class="text-foreground/90">
            You have logged {(data.hours_in_last_6mo / 60 / 60).toFixed(
              1,
            )}/{data.required_hrs_in_last_6mo / 60 / 60} hours in the last 6 months
          </span>
        </li>
        <li class="flex">
          {#if data.canVisit}
            <CircleCheck class="text-green-500 min-w-6 min-h-6 mr-2" />
          {:else}
            <CircleX class="text-red-500 min-w-6 min-h-6 mr-2" />
          {/if}
          <span class="text-foreground/90">
            Do you meet all of the above requirements?
          </span>
        </li>
      </ul>
    </Card.Header>
    <Card.Footer>
      {#if data.canVisit}
        <Button
          href="/visitor_application/apply/select_facility/"
          class="w-full">
          Apply to visit
        </Button>
      {:else}
        <p class="text-foreground/60">
          You do not meet the visiting requirements :(
        </p>
      {/if}
    </Card.Footer>
  </Card.Root>
</div>
