<script lang="ts">
  import { type UserFacilityAssignment } from "@prisma/client";
  import { Badge } from "$lib/components/ui/badge";
  import { page } from "$app/stores";
  import { color } from "$lib/colors";

  export let userAssignment: UserFacilityAssignment;
</script>

<div class="space-x-2">
  {userAssignment.user.name}
</div>
