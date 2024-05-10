<script lang="ts">
  import type { Certificate, User } from "@prisma/client";
  import CertificateBadge from "./CertificateBadge.svelte";

  export let heldCertificates: (Certificate & { instructor: User })[];
  export let holder: User;
</script>

<div class="space-x-1 space-y-2 leading-3">
  {#each heldCertificates as cert}
    <CertificateBadge {cert} {holder} />
  {/each}
</div>
