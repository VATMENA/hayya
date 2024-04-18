<script lang="ts">
  export let id: number | null;
  export let facilityId: string | null;
</script>

{#if id}
  <a href="/{facilityId}/tvc/case/{id}">Case #{id}</a>
{:else}
  N/A
{/if}
