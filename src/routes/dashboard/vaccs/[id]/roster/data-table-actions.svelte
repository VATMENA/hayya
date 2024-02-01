<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import { CalendarIcon, MoreHorizontal } from "lucide-svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Tabs from "$lib/components/ui/tabs";
  import * as Popover from "$lib/components/ui/popover";
  import * as Select from "$lib/components/ui/select";
  import { can } from "$lib/perms/can";
  import { page } from "$app/stores";
  import type { User } from "@prisma/client";
  import CertForm from "./cert-form.svelte";
  import { goto, invalidate, invalidateAll } from "$app/navigation";

  export let user: User;

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
    data.set("user", cid);
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
      <MoreHorizontal class="w-4 h-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Item
        on:click={() => navigator.clipboard.writeText(user.id)}>
        Copy CID
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>View user profile</DropdownMenu.Item>
    <DropdownMenu.Separator />
    {#if can($page.data.roles, $page.data.vacc_id, $page.data.user.vaccId, `vacc.${$page.data.vacc_id}.training.issue_certificate`)}
      <DropdownMenu.Item
        on:click={() => {
          cert_issue_open = true;
        }}>
        Issue certificate
      </DropdownMenu.Item>
    {/if}
    {#if can($page.data.roles, $page.data.vacc_id, $page.data.user.vaccId, `vacc.${$page.data.vacc_id}.role.assign`)}
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>Toggle Roles</DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent>
          <DropdownMenu.Label>Toggle Roles</DropdownMenu.Label>
          <DropdownMenu.Separator />
          {#each $page.data.all_roles as role}
            <DropdownMenu.CheckboxItem
              on:click={async () => {
                await toggleRole(user.id, user.roleIds, role.id);
              }}
              checked={user.roleIds.includes(role.id)}>
              {role.name}
            </DropdownMenu.CheckboxItem>
          {/each}
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>

{#if can($page.data.roles, $page.data.vacc_id, $page.data.user.vaccId, `vacc.${$page.data.vacc_id}.training.issue_certificate`)}
  <Dialog.Root bind:open={cert_issue_open}>
    <Dialog.Content class="max-w-[40rem]">
      <Dialog.Header>
        <Dialog.Title>Issue certificate for {user.name}</Dialog.Title>
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
        theForm={$page.data.form}
        {user} />
    </Dialog.Content>
  </Dialog.Root>
{/if}
