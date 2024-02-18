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
        Select which HQ should be the active session. Only HQs that you have
        access to are shown.
      </Card.Description>
    </Card.Header>
    <Card.Content class="grid space-y-4">
      <div class="flex items-center justify-between space-x-4">
        <div class="flex items-center space-x-4">
          <div>
            <p class="text-sm font-medium leading-none">Division</p>
            <p class="text-sm text-muted-foreground leading-none mt-1">MENA</p>
          </div>
        </div>
        <Button href="/dashboard/division/" variant="outline" class="ml-auto">
          Enter
          <LogIn class="ml-2 h-4 w-4" />
        </Button>
      </div>
      {#each data.shown_vaccs as vacc}
        <div class="flex items-center justify-between space-x-4">
          <div class="flex items-center space-x-4">
            <div>
              <p class="text-sm font-medium leading-none">{vacc.name}</p>
              <p class="text-sm text-muted-foreground leading-none mt-1">
                {vacc.id}
              </p>
            </div>
          </div>
          <Button
            href="/dashboard/vaccs/{vacc.id}"
            variant="outline"
            class="ml-auto">
            Enter
            <LogIn class="ml-2 h-4 w-4" />
          </Button>
        </div>
      {/each}
    </Card.Content>
  </Card.Root>
</div>
