<script lang="ts">
  import { type User, type UserFacilityAssignment } from "@prisma/client";

  export let userAssignment: UserFacilityAssignment & { user: User };
</script>

<div class="space-x-2">
  {userAssignment.user.name}
</div>
