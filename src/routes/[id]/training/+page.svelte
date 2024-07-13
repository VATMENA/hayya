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
  import { MANAGE_TRAINING_PLANS } from "$lib/perms/permissions";
  import { CogIcon } from "lucide-svelte";

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
      <p>Hayya's training system is undergoing a major overhaul and has been temporarily disabled. We apologise for the inconvenience. Please check again later.</p>
    </Card.Content>
  </Card.Root>

  {#if can(MANAGE_TRAINING_PLANS)}
    <Card.Root>
      <Card.Header>
        <Card.Title>Training Plans</Card.Title>
      </Card.Header>
      <Card.Content>
        <Button href="/{$page.params.id}/training/plans">
          <CogIcon class="w-4 h-4 mr-2" />
          Manage Training Plans
        </Button>
      </Card.Content>
    </Card.Root>
  {/if}
</div>
