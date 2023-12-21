<script lang="ts">
    import type {PageData} from "./$types";
    import {can} from "$lib/perms";
    import {Skeleton} from "$lib/components/ui/skeleton";
    import {
        ROLE_CONTROLLER_ID,
        ROLE_DEVELOPER_ID,
        ROLE_DIVISION_DIRECTOR_ID,
        ROLE_DIVISION_STAFF_ID, ROLE_MEMBER_ID, ROLE_MENTOR_ID,
        ROLE_VACC_DIRECTOR_ID, ROLE_VACC_STAFF_ID
    } from "$lib/roles";
    import {Badge} from "$lib/components/ui/badge";
    import {Button} from "$lib/components/ui/button";
    import * as Alert from "$lib/components/ui/alert";
    import * as Tabs from "$lib/components/ui/tabs";
    import * as Card from "$lib/components/ui/card";
    import * as Table from "$lib/components/ui/table";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import {page} from "$app/stores";

    export let data: PageData;

    let error: string | null = null;

    async function toggleRole(cid: string, existing_roles: string[], new_role: string) {
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
        let resp = await fetch("/api/roster/assign_role", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-HQ-Token": "" // TODO
            },
            body: JSON.stringify({user: cid, roles: new_roles})
        });
        if (!resp.ok) {
            throw new Error("server returned error response, see console for details");
        }
        window.location.reload();
    }
</script>

<div class="flex items-center justify-between space-y-2">
    <h2 class="text-3xl font-bold tracking-tight">vACC Roster - {$page.params.id}</h2>
</div>

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
            {#if can(data.roles, ["division.role.assign"]) || can(data.roles, ["vacc.role.assign"])}
                <Table.Head>Actions</Table.Head>
            {/if}
        </Table.Row>
    </Table.Header>
    <Table.Body>
        {#each data.vacc_users as user}
            {#if user.roleIds.length === 1 && user.roleIds[0] === ROLE_CONTROLLER_ID && user.vacc == null && user.ratingShort === "OBS"}
                <!-- skip -->
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
                    <Table.Cell
                    >{user.vacc == null ? "N/A" : user.vacc}</Table.Cell
                    >
                    {#if can(data.roles, ["division.role.assign"]) || (can(data.roles, ["vacc.role.assign"]) && user.vacc === data.user.vacc)}
                        <Table.Cell>
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild let:builder>
                                    <Button builders={[builder]} variant="outline">Toggle Role</Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                    <DropdownMenu.Group>
                                        <DropdownMenu.Label>Toggle Role</DropdownMenu.Label>
                                        <DropdownMenu.Separator/>
                                        <DropdownMenu.Item
                                                on:click={() => {toggleRole(user.cid, user.roleIds, ROLE_DEVELOPER_ID)}}>
                                            Developer
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                                on:click={() => {toggleRole(user.cid, user.roleIds, ROLE_DIVISION_DIRECTOR_ID)}}>
                                            Division Director
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                                on:click={() => {toggleRole(user.cid, user.roleIds, ROLE_DIVISION_STAFF_ID)}}>
                                            Division Staff
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                                on:click={() => {toggleRole(user.cid, user.roleIds, ROLE_VACC_DIRECTOR_ID)}}>
                                            vACC Director
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                                on:click={() => {toggleRole(user.cid, user.roleIds, ROLE_VACC_STAFF_ID)}}>
                                            vACC Staff
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                                on:click={() => {toggleRole(user.cid, user.roleIds, ROLE_MENTOR_ID)}}>
                                            Mentor
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                                on:click={() => {toggleRole(user.cid, user.roleIds, ROLE_CONTROLLER_ID)}}>
                                            Controller
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                                on:click={() => {toggleRole(user.cid, user.roleIds, ROLE_MEMBER_ID)}}>
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
