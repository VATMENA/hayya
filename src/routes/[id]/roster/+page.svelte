<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import DataTable from "./data-table.svelte";

  export let data: PageData;

  let error: string | null = null;

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
    window.location.reload();
  }
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">
    Facility Roster - {$page.params.id}
  </h2>
</div>

<DataTable data={data.users} />

<!--
<Alert.Root>
  <Alert.Title>Heads up!</Alert.Title>
  <Alert.Description>
    Rosters are updated hourly. If information is outdated, check back later!
  </Alert.Description>
</Alert.Root>

{#if error != null}
  <Alert.Root variant="destructive">
    <Alert.Title>Failed to load a roster</Alert.Title>
    <Alert.Description>
      {error}
    </Alert.Description>
  </Alert.Root>
{/if}

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
      <Table.Head>Rating</Table.Head>
      <Table.Head>vACC</Table.Head>
      {#if can(data.roles, $page.params.id, data.user.vaccId, `vacc.${$page.params.id}.role.assign`)}
        <Table.Head>Actions</Table.Head>
      {/if}
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#if data.home_users.length === 0}
      <Table.Row>
        <Table.Cell>
          <Skeleton class="h-4"></Skeleton>
        </Table.Cell>
        <Table.Cell>
          <Skeleton class="h-4"></Skeleton>
        </Table.Cell>
        <Table.Cell>
          <Skeleton class="h-4"></Skeleton>
        </Table.Cell>
      </Table.Row>
    {/if}
    {#each data.home_users as user}
      {#if user.roleIds.length === 1 && user.roleIds[0] === ROLE_CONTROLLER_ID && user.vacc == null && user.ratingShort === "OBS"}
      {:else}
        <Table.Row>
          <Table.Cell class="space-x-1">
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
          </Table.Cell>
          <Table.Cell>{user.ratingShort}</Table.Cell>
          <Table.Cell>{user.vaccId == null ? "N/A" : user.vaccId}</Table.Cell>
          {#if can(data.roles, user.vaccId, data.user.vaccId, `vacc.${user.vaccId}.role.assign`)}
            <Table.Cell>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild let:builder>
                  <Button builders={[builder]} variant="outline">
                    Toggle Role
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Group>
                    <DropdownMenu.Label>Toggle Role</DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item
                      on:click={() => {
                        toggleRole(user.id, user.roleIds, ROLE_DEVELOPER_ID);
                      }}>
                      Developer
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      on:click={() => {
                        toggleRole(
                          user.id,
                          user.roleIds,
                          ROLE_DIVISION_DIRECTOR_ID,
                        );
                      }}>
                      Division Director
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      on:click={() => {
                        toggleRole(
                          user.id,
                          user.roleIds,
                          ROLE_DIVISION_STAFF_ID,
                        );
                      }}>
                      Division Staff
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      on:click={() => {
                        toggleRole(
                          user.id,
                          user.roleIds,
                          ROLE_VACC_DIRECTOR_ID,
                        );
                      }}>
                      vACC Director
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      on:click={() => {
                        toggleRole(user.id, user.roleIds, ROLE_VACC_STAFF_ID);
                      }}>
                      vACC Staff
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      on:click={() => {
                        toggleRole(user.id, user.roleIds, ROLE_MENTOR_ID);
                      }}>
                      Mentor
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      on:click={() => {
                        toggleRole(user.id, user.roleIds, ROLE_CONTROLLER_ID);
                      }}>
                      Controller
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      on:click={() => {
                        toggleRole(user.id, user.roleIds, ROLE_MEMBER_ID);
                      }}>
                      VATSIM Member
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Table.Cell>
          {/if}
        </Table.Row>
      {/if}
    {/each}
  </Table.Body>
</Table.Root>
-->
