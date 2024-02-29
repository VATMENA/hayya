<script lang="ts">
  import { type UserFacilityAssignment } from "@prisma/client";
  import { Badge } from "$lib/components/ui/badge";
  import { page } from "$app/stores";
  import { color } from "$lib/colors";

  export let userAssignment: UserFacilityAssignment;
</script>

<div class="space-x-2">
  {userAssignment.user.name}
  {#if Object.keys(userAssignment).includes("roles")}
    {#each userAssignment.roles as role}
      {#each $page.data.facility.roles as possibleRole}
        {#if role.id === possibleRole.id}
          <Badge style="background-color: {color(role.color)}">
            {possibleRole.name}
          </Badge>
        {/if}
      {/each}
    {/each}
  {/if}
</div>
