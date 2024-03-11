<script lang="ts">
  import type { Certificate, User } from "@prisma/client";
  import CertificateBadge from "./CertificateBadge.svelte";

  export let heldCertificates: Certificate[];
  export let holder: User;
</script>

<div class="space-x-1">
  {#each heldCertificates as cert}
    <CertificateBadge {cert} {holder} />
  {/each}
</div>
