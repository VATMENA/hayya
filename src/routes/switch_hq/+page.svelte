<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import type { PageData } from "./$types";
  import { LogIn } from "lucide-svelte";

  export let data: PageData;
</script>

<div class="h-screen flex flex-col p-6 space-y-4 items-center justify-center">
  <Card.Root class="w-[20em] justify-center content-center">
    <Card.Header>
      <Card.Title>Switch HQ</Card.Title>
      <Card.Description>
        Select which HQ should be the active session. Access lists are refreshed
        every hour - if you don't see a facility that you recently gained access
        to, please check back later!
      </Card.Description>
    </Card.Header>
    <Card.Content class="grid space-y-4">
      {#each data.user.facilities as facilityAssignment}
        <div class="flex items-center justify-between space-x-4">
          <div class="flex items-center space-x-4">
            <div>
              <p class="text-sm font-medium leading-none">
                {facilityAssignment.facility.name}
              </p>
              <p class="text-sm text-muted-foreground leading-none mt-1">
                {facilityAssignment.facility.id}
              </p>
            </div>
          </div>
          <Button
            href={facilityAssignment.facility.id}
            variant="outline"
            class="ml-auto">
            Enter
            <LogIn class="ml-2 h-4 w-4" />
          </Button>
        </div>
      {/each}
    </Card.Content>
    <Card.Footer>
      <Card.Description>
        Just looking for the rosters? <a
          class="underline underline-offset-4"
          href="/switch_hq/rosters">
          Find them here!
        </a>
        <br>
        <br>
        Looking to visit a facility? <a class="underline underline-offset-4" href="/visitor_application">Apply here!</a>
      </Card.Description>
    </Card.Footer>
  </Card.Root>
</div>
