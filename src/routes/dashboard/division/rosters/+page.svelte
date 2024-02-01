<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">Division Rosters</h2>
</div>

<Card.Root>
  <Card.Header>
    <Card.Title>vACC Rosters</Card.Title>
    <Card.Description>
      Select a facility below to access vACC rosters.
    </Card.Description>
  </Card.Header>

  <Card.Content class="space-y-2">
    {#each data.vaccs as vacc}
      <Button href="/dashboard/vaccs/{vacc.id}/roster">{vacc.name}</Button>
      <br />
    {/each}
  </Card.Content>
</Card.Root>
