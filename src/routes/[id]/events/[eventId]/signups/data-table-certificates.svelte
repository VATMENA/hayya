<script lang="ts">
  import type { User } from "@prisma/client";
  import CertificateBadge from "./CertificateBadge.svelte";

  export let heldCertificates: any;
</script>

<div class="space-x-1 space-y-2 leading-3">
  {#each heldCertificates as cert}
    <CertificateBadge {cert} />
  {/each}
</div>
