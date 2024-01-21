<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Progress } from "$lib/components/ui/progress";
  import { Button } from "$lib/components/ui/button";
  import { LogInIcon, LogOutIcon, SettingsIcon } from "lucide-svelte";
  import { canAny } from "$lib/perms/can";
  import { page } from "$app/stores";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">Training</h2>
</div>

<div class="grid grid-cols-3">
  <div>
    <Card.Root>
      <Card.Header>
        <Card.Title>Training Queues</Card.Title>
      </Card.Header>
      <Card.Content class="space-y-1.5">
        {#if data.memberOfQueue !== null}
          <p>
            Enrolled in the <b>Basic/S1</b>
            queue.
          </p>
          <Progress value={(177 / 300) * 100} />
          <p class="text-xs text-foreground/60">Position #177 in the queue</p>
          <Button
            href="/dashboard/vaccs/{$page.params.id}/training/queues/{data
              .memberOfQueue.id}/leave">
            <LogOutIcon class="mr-2 w-4 h-4" />
            Leave
          </Button>
        {:else}
          <p>Not currently a member of any queue.</p>
          <Button href="/dashboard/vaccs/{$page.params.id}/training/queues">
            <LogInIcon class="mr-2 w-4 h-4" />
            Join A Queue
          </Button>
        {/if}
        {#if canAny( $page.data.roles, $page.params.id, $page.data.user.vaccId, [`vacc.${$page.params.id}.training.queues.manage`, `vacc.${$page.params.id}.training.queues.recommend`], )}
          <Button
            href="/dashboard/vaccs/{$page.params.id}/training/queues/manage">
            <SettingsIcon class="mr-2 w-4 h-4" />
            Manage Queues
          </Button>
        {/if}
      </Card.Content>
    </Card.Root>
  </div>
</div>
