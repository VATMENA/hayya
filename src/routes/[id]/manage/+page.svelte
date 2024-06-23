<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import type { PageData } from "./$types";
  import { Badge } from "$lib/components/ui/badge";
  import { color } from "$lib/colors";
  import Button from "$lib/components/ui/button/button.svelte";
  import Plus from "lucide-svelte/icons/plus";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";

  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addPage($page.data.url, "Manage");
  }
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Manage Facility</h2>
</div>

<div class="flex max-w-lg flex-col gap-y-4 pt-2">
  <Card.Root>
    <Card.Header>
      <Card.Title>Roles</Card.Title>
      <Button href="/{data.facility.id}/manage/createrole">
        <Plus class="mr-2 h-4 w-4" />
        Create
      </Button>
    </Card.Header>
    <Card.Content class="space-y-1.5">
      {#each data.facility.roles as role}
        <Badge
          href="/{data.facility.id}/manage/editrole/{role.id}"
          style="background-color: {color(role.color)};">
          {role.name}
        </Badge>
      {/each}
    </Card.Content>
  </Card.Root>
  <Card.Root>
    <Card.Header>
      <Card.Title>Actions</Card.Title>
    </Card.Header>
    <Card.Content>
      <Button href="/{data.facility.id}/edit">Edit Facility Details</Button>
    </Card.Content>
  </Card.Root>
</div>
