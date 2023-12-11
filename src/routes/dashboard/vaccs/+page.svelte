<script lang="ts">
    import type { PageData } from "./$types";
    import * as Table from "$lib/components/ui/table";
    import { Button } from "$lib/components/ui/button";
    import {can} from "$lib/perms";

    export let data: PageData;
</script>

<Table.Root>
    <Table.Header>
        <Table.Row>
            <Table.Head>ID</Table.Head>
            <Table.Head>Name</Table.Head>
            <Table.Head>Website</Table.Head>
            <Table.Head>Contact Email</Table.Head>
            <Table.Head>Actions</Table.Head>
        </Table.Row>
    </Table.Header>
    <Table.Body>
        {#each data.vaccs as vacc}
            <Table.Row>
                <Table.Cell>{vacc.id}</Table.Cell>
                <Table.Cell>{vacc.name}</Table.Cell>
                <Table.Cell>{vacc.website}</Table.Cell>
                <Table.Cell>{vacc.contact_email}</Table.Cell>
                <Table.Cell>
                    <Button href="/dashboard/vaccs/{vacc.id}/roster">Roster</Button>
                    {#if can(data.roles, ["vacc.details.edit"])}
                        <Button href="/dashboard/vaccs/{vacc.id}/edit">Edit Details</Button>
                    {/if}
                </Table.Cell>
            </Table.Row>
        {/each}
    </Table.Body>
</Table.Root>
