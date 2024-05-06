<script lang="ts">
  export let id: number | null;
  export let facilityId: string | null;
</script>

{#if id}
  <a class="underline underline-offset-4" href="/{facilityId}/tvc/case/{id}">#{id}</a>
{:else}
  N/A
{/if}
