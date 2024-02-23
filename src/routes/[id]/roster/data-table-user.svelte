<script lang="ts">
  import type { User } from "@prisma/client";
  import {
    ROLE_DEVELOPER_ID,
    ROLE_DIVISION_DIRECTOR_ID,
    ROLE_DIVISION_STAFF_ID,
    ROLE_MENTOR_ID,
    ROLE_VACC_DIRECTOR_ID,
    ROLE_VACC_STAFF_ID,
  } from "$lib/roles";
  import { Badge } from "$lib/components/ui/badge";

  export let user: User;
</script>

<div class="space-x-2">
  {user.name}
  {#each user.roleIds as role}
    {#if role === ROLE_DEVELOPER_ID}
      <Badge class="bg-fuchsia-500">Developer</Badge>
    {:else if role === ROLE_DIVISION_DIRECTOR_ID}
      <Badge class="bg-red-500">Division Director</Badge>
    {:else if role === ROLE_DIVISION_STAFF_ID}
      <Badge class="bg-orange-500">Division Staff</Badge>
    {:else if role === ROLE_VACC_DIRECTOR_ID}
      <Badge class="bg-emerald-500">vACC Director</Badge>
    {:else if role === ROLE_VACC_STAFF_ID}
      <Badge class="bg-green-500">vACC Staff</Badge>
    {:else if role === ROLE_MENTOR_ID}
      <Badge class="bg-sky-500">Mentor</Badge>
    {/if}
  {/each}
</div>
