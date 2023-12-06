<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs";
    import * as Card from "$lib/components/ui/card";
    import * as Table from "$lib/components/ui/table";
    import { Badge } from "$lib/components/ui/badge";
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
                </Card.Header>
                <Card.Content>

                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.Head>Name</Table.Head>
                                <Table.Head>Rating</Table.Head>
                                <Table.Head>vACC</Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Web Eight <Badge class="bg-fuchsia-500">Developer</Badge></Table.Cell>
                                <Table.Cell>I1</Table.Cell>
                                <Table.Cell>N/A</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Test User One <Badge class="bg-red-500">Division Director</Badge></Table.Cell>
                                <Table.Cell>I1</Table.Cell>
                                <Table.Cell>N/A</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Test User Two <Badge class="bg-orange-500">Division Staff</Badge></Table.Cell>
                                <Table.Cell>I1</Table.Cell>
                                <Table.Cell>N/A</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Test User Three <Badge class="bg-emerald-500">Arabian vACC Director</Badge></Table.Cell>
                                <Table.Cell>I1</Table.Cell>
                                <Table.Cell>N/A</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Test User Four <Badge class="bg-green-500">Arabian vACC Staff</Badge></Table.Cell>
                                <Table.Cell>I1</Table.Cell>
                                <Table.Cell>N/A</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Test User Five <Badge class="bg-sky-500">Mentor</Badge></Table.Cell>
                                <Table.Cell>I1</Table.Cell>
                                <Table.Cell>N/A</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>

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
