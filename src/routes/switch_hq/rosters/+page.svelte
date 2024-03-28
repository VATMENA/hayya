<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import type { PageData } from "./$types";
  import LogIn from "lucide-svelte/icons/log-in";

  export let data: PageData;
</script>

<div class="h-screen flex flex-col p-6 space-y-4 items-center justify-center">
  <Card.Root class="w-[20em] justify-center content-center">
    <Card.Header>
      <Card.Title>View Rosters</Card.Title>
      <Card.Description>
        Select a facility to view it's controller roster and certifications.
      </Card.Description>
    </Card.Header>
    <Card.Content class="grid space-y-4">
      {#each data.facilities as facility}
        <div class="flex items-center justify-between space-x-4">
          <div class="flex items-center space-x-4">
            <div>
              <p class="text-sm font-medium leading-none">
                {facility.name}
              </p>
              <p class="text-sm text-muted-foreground leading-none mt-1">
                {facility.id}
              </p>
            </div>
          </div>
          <Button
            href="/{facility.id}/roster"
            variant="outline"
            class="ml-auto">
            View
            <LogIn class="ml-2 h-4 w-4" />
          </Button>
        </div>
      {/each}
    </Card.Content>
    <Card.Footer>
      <Card.Description>
        Want to go to a facility's HQ? <a
          class="underline underline-offset-4"
          href="/switch_hq">
          Find them here!
        </a>
      </Card.Description>
    </Card.Footer>
  </Card.Root>
</div>
