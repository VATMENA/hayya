<script lang="ts">
  import { Button } from "$lib/components/ui/button";

  export let link: string;
  export let hasEditPermission: boolean = false;
</script>

<Button href={link} variant="outline">View</Button>
{#if hasEditPermission}
  <Button variant="outline">Delete</Button>
{/if}
