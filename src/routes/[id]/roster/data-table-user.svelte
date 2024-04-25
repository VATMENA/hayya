<script lang="ts">
  import {
    type Role,
    type User,
    type UserFacilityAssignment,
  } from "@prisma/client";
  import { Badge } from "$lib/components/ui/badge";
  import { page } from "$app/stores";
  import { color } from "$lib/colors";

  export let userAssignment: UserFacilityAssignment & {
    user: User;
    roles: Role[];
  };
</script>

<div class="space-x-2">
  {userAssignment.user.name}
  {#if userAssignment.assignmentType === "Secondary" && userAssignment.facilityId !== "MENA"}
    <Badge style="background-color: bg-forest-500">Visitor</Badge>
  {/if}
  {#each userAssignment.roles as role}
    {#each $page.data.facility.roles as possibleRole}
      {#if role.id === possibleRole.id}
        <Badge style="background-color: {color(role.color)}">
          {possibleRole.name}
        </Badge>
      {/if}
    {/each}
  {/each}
</div>
