<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs";
    import * as Card from "$lib/components/ui/card";
</script>

<div class="flex-1 space-y-4 p-8 pt-6">
    <div class="flex items-center justify-between space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">Division Roster</h2>
    </div>

    <Tabs.Root>
        <Tabs.List class="grid w-full grid-cols-3">
            <Tabs.Trigger value="home">Full Division Home Roster</Tabs.Trigger>
            <Tabs.Trigger value="visitor">Full Division Visitor Roster</Tabs.Trigger>
            <Tabs.Trigger value="vacc">vACC Rosters</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="home">
            <Card.Root>
                <Card.Header>
                    <Card.Title>Full Division Home Roster</Card.Title>
                    <Card.Description>
                        Members which do not hold a staff position, are not registered with a vACC, and do not hold any ratings are omitted.
                    </Card.Description>
                </Card.Header>
                <Card.Content class="space-y-2">

                </Card.Content>
            </Card.Root>
        </Tabs.Content>
        <Tabs.Content value="visitor">
            <Card.Root>
                <Card.Header>
                    <Card.Title>Full Division Visitor Roster</Card.Title>
                    <Card.Description>
                        Want to visit one of VATMENA's vACCs? Apply here! (link pending)
                    </Card.Description>
                </Card.Header>

                <Card.Content class="space-y-2">

                </Card.Content>
            </Card.Root>
        </Tabs.Content>
        <Tabs.Content value="vacc">
            <Card.Root>
                <Card.Header>
                    <Card.Title>vACC Rosters</Card.Title>
                    <Card.Description>
                        Click each button below to access vACC member rosters.
                    </Card.Description>
                </Card.Header>

                <Card.Content class="space-y-2">

                </Card.Content>
            </Card.Root>
        </Tabs.Content>
    </Tabs.Root>
</div>
