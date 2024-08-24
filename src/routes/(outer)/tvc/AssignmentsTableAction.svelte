<script lang="ts">
  // @formatter:off
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  // @formatter:on
  import type { UserFacilityAssignment } from "@prisma/client";
  import { Button } from "$lib/components/ui/button";
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import { toast } from "svelte-sonner";

  export let data: UserFacilityAssignment;
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      variant="ghost"
      builders={[builder]}
      size="icon"
      class="relative h-8 w-8 p-0">
      <span class="sr-only">Open menu</span>
      <Ellipsis class="h-4 w-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Item
        on:click={() => {
          navigator.clipboard.writeText(data.id);
          toast.success("Assignment ID copied to clipboard successfully!");
        }}>
        Copy assignment ID
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item href="/{data.facilityId}">Open HQ</DropdownMenu.Item>
    {#if data.caseId}
      <DropdownMenu.Item href="/{data.facilityId}/tvc/cases/{data.caseId}">
        View case history
      </DropdownMenu.Item>
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>
