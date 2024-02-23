<script lang="ts">
  import type { Certificate } from "@prisma/client";
  import CertificateBadge from "$lib/components/CertificateBadge.svelte";

  export let heldCertificates: Certificate[];
</script>

<div class="space-x-1">
  {#each heldCertificates as cert}
    <CertificateBadge {cert} />
  {/each}
</div>
