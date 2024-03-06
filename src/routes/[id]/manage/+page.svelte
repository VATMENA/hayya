<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import type { PageData } from "./$types";
  import { Badge } from "$lib/components/ui/badge";
  import { color } from "$lib/colors";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Plus } from "lucide-svelte";

  export let data: PageData;
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Manage Facility</h2>
  <Button href="/{data.facility.id}/manage/createrole">
    <Plus class="mr-2 w-4 h-4" />
    Create
  </Button>
</div>

<div class="grid grid-cols-3 gap-4">
  <div>
    <Card.Root>
      <Card.Header>
        <Card.Title>Roles</Card.Title>
      </Card.Header>
      <Card.Content class="space-y-1.5">
        {#each data.facility.roles as role}
          <Badge style="background-color: {color(role.color)};">
            {role.name}
          </Badge>
        {/each}
      </Card.Content>
    </Card.Root>
  </div>
</div>
