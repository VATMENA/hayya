<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import { AlertTriangleIcon, LogInIcon } from "lucide-svelte";
  import { page } from "$app/stores";

  export let id: string;
  export let canJoin: boolean;
  export let canLeave: boolean;
</script>

{#if canJoin}
  <Button href="/dashboard/vaccs/{$page.params.id}/training/queues/{id}/join">
    <LogInIcon class="mr-2 w-4 h-4" />
    Join
  </Button>
{/if}
{#if canLeave}
  <Button href="/dashboard/vaccs/{$page.params.id}/training/queues/{id}/leave">
    <AlertTriangleIcon class="mr-2 w-4 h-4" />
    Leave
  </Button>
{/if}
