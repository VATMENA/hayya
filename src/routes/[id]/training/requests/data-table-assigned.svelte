<script lang="ts">
  import type { User } from "@prisma/client";

  export let instructor: User | null;
</script>

{#if instructor}
  Assigned to {instructor.name}
{:else}
  No
{/if}
