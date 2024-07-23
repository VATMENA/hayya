<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import type { PageData } from "./$types";
  import { Badge } from "$lib/components/ui/badge";
  import { color } from "$lib/colors";
  import Button from "$lib/components/ui/button/button.svelte";
  import Plus from "lucide-svelte/icons/plus";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  import { can } from "$lib/perms/can";
  import { MANAGE_PLAN_ENROLLMENT_REQUESTS, MANAGE_TRAINING_PLANS } from "$lib/perms/permissions";
  import { CogIcon, DoorOpenIcon, MailsIcon, XCircleIcon } from "lucide-svelte";

  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addPage($page.data.url, "Training");
  }
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Training</h2>
</div>

<div class="flex max-w-lg flex-col gap-y-4 pt-2">
  <Card.Root>
    <Card.Header>
      <Card.Title>Your Training</Card.Title>
    </Card.Header>
    <Card.Content>
      {#if data.activePlan}
        <p>You're currently enrolled in the {data.activePlan.plan.name} plan.</p>
        <Button>
          <DoorOpenIcon class="w-4 h-4 mr-2" />
          Leave Plan
        </Button>
      {:else if data.activePlanRequest}
        <p>You currently have an outstanding request to join the {data.activePlanRequest.plan.name} plan.</p>
        <Button>
          <XCircleIcon class="w-4 h-4 mr-2" />
          Cancel Request
        </Button>
      {:else}
        <Button>
          <DoorOpenIcon class="w-4 h-4 mr-2" />
          Enroll
        </Button>
      {/if}
    </Card.Content>
  </Card.Root>

  {#if can(MANAGE_TRAINING_PLANS) || can(MANAGE_PLAN_ENROLLMENT_REQUESTS)}
    <Card.Root>
      <Card.Header>
        <Card.Title>Training Plans</Card.Title>
      </Card.Header>
      <Card.Content>
        {#if can(MANAGE_TRAINING_PLANS)}
          <Button href="/{$page.params.id}/training/plans">
            <CogIcon class="mr-2 h-4 w-4" />
            Manage Training Plans
          </Button>
        {/if}

        {#if can(MANAGE_PLAN_ENROLLMENT_REQUESTS)}
          <Button href="/{$page.params.id}/training/plans/requests">
            <MailsIcon class="mr-2 h-4 w-4" />
            Manage Plan Join Requests
          </Button>
        {/if}
      </Card.Content>
    </Card.Root>
  {/if}
</div>
