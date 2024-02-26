<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";

  export let rating: string;
</script>

{#if rating === "OBS"}
  <Badge class="bg-gray-500">OBS</Badge>
{:else if rating === "S1"}
  <Badge class="bg-yellow-500">S1</Badge>
{:else if rating === "S2"}
  <Badge class="bg-yellow-500">S2</Badge>
{:else if rating === "S3"}
  <Badge class="bg-yellow-500">S3</Badge>
{:else if rating === "C1"}
  <Badge class="bg-green-500">C1</Badge>
{:else if rating === "C2"}
  <Badge class="bg-green-500">C2</Badge>
{:else if rating === "C3"}
  <Badge class="bg-green-500">C3</Badge>
{:else if rating === "I1"}
  <Badge class="bg-red-500">I1</Badge>
{:else if rating === "I2"}
  <Badge class="bg-red-500">I2</Badge>
{:else if rating === "I3"}
  <Badge class="bg-red-500">I3</Badge>
{:else if rating === "SUP"}
  <Badge class="bg-purple-500">SUP</Badge>
{:else if rating === "ADM"}
  <Badge class="bg-fuchsia-500">ADM</Badge>
{/if}
