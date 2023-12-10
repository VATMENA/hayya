<script lang="ts">
    import Nav from "$lib/components/Nav.svelte";
    import {Button} from "$lib/components/ui/button";
    import {needsPermissions} from "$lib/perms";
    import * as Card from "$lib/components/ui/card";

    needsPermissions(["system.log.view"])
</script>

<div class="flex-1 space-y-4 p-8 pt-6">
    <div class="flex items-center justify-between space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">System Management</h2>
    </div>

    <div class="grid grid-cols-3 gap-5 space-y-5">
        <div>
            <Card.Root>
                <Card.Header>
                    <Card.Title>Management Tasks</Card.Title>
                    <Card.Description>
                        <Button class="mt-2" on:click={() => {window.location.href="/dashboard/system/audit_log"}}>View Audit Log</Button>
                    </Card.Description>
                </Card.Header>
            </Card.Root>
        </div>
    </div>
</div>
