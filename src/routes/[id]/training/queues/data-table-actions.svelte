<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import LogInIcon from "lucide-svelte/icons/log-in";
  import AlertTriangleIcon from "lucide-svelte/icons/triangle-alert";
  import { page } from "$app/stores";
  import { can } from "$lib/perms/can";
  import { MANAGE_QUEUES, RECOMMEND_FOR_QUEUE } from "$lib/perms/permissions";
  import SettingsIcon from "lucide-svelte/icons/settings";
  import { toast } from "svelte-sonner";
  import { goto, invalidateAll } from "$app/navigation";

  export let id: string;
  export let canJoin: boolean;
  export let canLeave: boolean;

  async function join() {
    let data = new URLSearchParams();
    data.set("id", id);
    await fetch("?/join", {
      method: "POST",
      body: data.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    await invalidateAll();
    await goto(`/${$page.params.id}/training`);
    toast.success("Queue joined successfully!");
  }
</script>

{#if canJoin}
  <Button on:click={join}>
    <LogInIcon class="mr-2 w-4 h-4" />
    Join
  </Button>
{/if}
{#if canLeave}
  <Button href="/{$page.params.id}/training/queues/{id}/leave">
    <AlertTriangleIcon class="mr-2 w-4 h-4" />
    Leave
  </Button>
{/if}
{#if can(RECOMMEND_FOR_QUEUE) || can(MANAGE_QUEUES)}
  <Button href="/{$page.params.id}/training/queues/{id}">
    <SettingsIcon class="mr-2 w-4 h-4" />
    Manage
  </Button>
{/if}
