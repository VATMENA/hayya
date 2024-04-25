<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";

  import CalendarIcon from "lucide-svelte/icons/calendar";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Tabs from "$lib/components/ui/tabs";
  import * as Popover from "$lib/components/ui/popover";
  import * as Select from "$lib/components/ui/select";
  import { can } from "$lib/perms/can";
  import { page } from "$app/stores";
  import {
    type Role,
    type User,
    type UserFacilityAssignment,
  } from "@prisma/client";
  import CertForm from "./cert-form.svelte";
  import { goto, invalidate, invalidateAll } from "$app/navigation";
  import { ASSIGN_ROLES, ISSUE_CERTIFICATE } from "$lib/perms/permissions";
  import { toast } from "svelte-sonner";
  import Ellipsis from "lucide-svelte/icons/ellipsis";

  export let user: UserFacilityAssignment & { user: User; roles: Role[] };

  let cert_issue_open = false;

  async function toggleRole(
    cid: string,
    existing_roles: string[],
    new_role: string,
  ) {
    let new_roles = [];
    if (existing_roles.includes(new_role)) {
      for (let item of existing_roles) {
        if (item != new_role) {
          new_roles.push(item);
        }
      }
    } else {
      new_roles = existing_roles;
      new_roles.push(new_role);
    }
    let data = new URLSearchParams();
    data.set("target", cid);
    data.set("roles", new_roles.join(","));

    let resp = await fetch("?/set_roles", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data.toString(),
    });
    if (!resp.ok) {
      throw new Error(
        "server returned error response, see console for details",
      );
    }
    await invalidateAll();
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      variant="ghost"
      builders={[builder]}
      size="icon"
      class="relative w-8 h-8 p-0">
      <span class="sr-only">Open menu</span>
      <Ellipsis class="w-4 h-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Item
        on:click={() => {
          navigator.clipboard.writeText(user.user.id);
          toast.success("CID copied to clipboard!");
        }}>
        Copy CID
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>View user profile</DropdownMenu.Item>

    {#if can(ISSUE_CERTIFICATE)}
      <DropdownMenu.Item
        on:click={() => {
          cert_issue_open = true;
        }}>
        Issue certificate
      </DropdownMenu.Item>
    {/if}
    {#if can(ASSIGN_ROLES)}
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>Toggle Roles</DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent>
          <DropdownMenu.Label>Toggle Roles</DropdownMenu.Label>
          <DropdownMenu.Separator />
          {#each $page.data.facility.roles as role}
            <DropdownMenu.CheckboxItem
              on:click={async () => {
                await toggleRole(
                  user.id,
                  user.roles.map((u) => {
                    return u.id;
                  }),
                  role.id,
                );
              }}
              checked={user.roles
                .map((u) => {
                  return u.id;
                })
                .includes(role.id)}>
              {role.name}
            </DropdownMenu.CheckboxItem>
          {/each}
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>

{#if can(ISSUE_CERTIFICATE)}
  <Dialog.Root bind:open={cert_issue_open}>
    <Dialog.Content class="max-w-[40rem]">
      <Dialog.Header>
        <Dialog.Title>Issue certificate for {user.user.name}</Dialog.Title>
        <Dialog.Description>
          Make sure the user has completed the needed training and certificates
          are issued according to vACC policy. Certificates can only be revoked
          by vACC senior staff.
        </Dialog.Description>
      </Dialog.Header>

      <CertForm
        onsubmit={async () => {
          cert_issue_open = false;
        }}
        data={$page.data.form}
        userId={user.userId} />
    </Dialog.Content>
  </Dialog.Root>
{/if}
