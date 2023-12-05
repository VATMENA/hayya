<script lang="ts">
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {Label} from "$lib/components/ui/label";
    import {Button} from "$lib/components/ui/button";
    import {Save} from "lucide-svelte";
    import {tick} from "svelte";
    import {Check, ChevronsUpDown} from "lucide-svelte";
    import * as Command from "$lib/components/ui/command";
    import * as Popover from "$lib/components/ui/popover";
    import * as Accordion from "$lib/components/ui/accordion";
    import {cn} from "$lib/utils";
    import {needsPermissions} from "$lib/perms";

    needsPermissions(["system.role.create", "system.role.delete", "system.role.edit"]);

    let permissions = {
        "system.feedback.view": "View HQ feedback",
        "system.feedback.delete": "Delete HQ feedback",
        "system.log.view": "View HQ log",
        "system.blacklist.add": "Add users to the HQ blacklist",
        "system.blacklist.remove": "Remove users from the HQ blacklist",
        "division.details.edit": "Edit division information",
        "division.vacc.create": "Create vACCs",
        "division.vacc.delete": "Delete vACCs",
        "vacc.details.edit": "Edit vACC details",
        "vacc.event.create": "Create a vACC event",
        "vacc.event.edit": "Edit a vACC event",
        "vacc.event.delete": "Delete a vACC event",
        "division.resource.create": "Create a division resource",
        "division.resource.delete": "Delete a division resource",
        "division.resource.edit": "Edit a division resource",
        "vacc.resource.create": "Create a vACC resource",
        "vacc.resource.edit": "Edit a vACC resource",
        "vacc.resource.delete": "Delete a vACC resource",
        "division.support": "Manage division support tickets",
        "vacc.support": "Manage vACC support tickets",
        "vacc.controller.feedback.view": "View vACC controller feedback",
        "vacc.controller.feedback.forward": "Forward vACC controller feedback to a specific controller",
        "division.announcement.create": "Create a division-wide announcement",
        "division.announcement.edit": "Edit a division-wide announcement",
        "division.announcement.delete": "Delete a division-wide announcement",
        "vacc.announcement.create": "Create a vACC specific announcement",
        "vacc.announcement.edit": "Edit a vACC specific announcement",
        "vacc.announcement.delete": "Delete a vACC specific announcement",
        "mentor.availability.create": "Create mentor availability",
        "mentor.availability.delete": "Delete mentor availability",
        "mentor.availability.edit": "Edit mentor availability",
        "mentor.training.request.accept": "Accept training requests",
        "mentor.training.request.reject": "Reject training requests",
        "mentor.training.notes.add": "Add mentor note to a training request",
        "mentor.training.notes.edit": "Edit mentor notes on a training request",
        "mentor.training.notes.delete": "Remove mentor notes from a training request",
        "mentor.training.exam": "Mark a student as exam-ready",
        "mentor.training.seminar.create": "Create a controller seminar",
        "mentor.training.seminar.delete": "Delete a controller seminar",
        "controller.event.booking.create": "Create request for an event position",
        "controller.event.booking.cancel": "Cancel request for an event position",
        "controller.resources.view": "View controller training resources",
        "controller.availability.add": "Add student availability",
        "controller.availability.delete": "Remove student availability",
        "controller.training.queue.join": "Join a training queue",
        "controller.training.queue.leave": "Leave a training queue"
    };

    let categories = {
        "system": "Permissions relating to MENA HQ and its internals",
        "division": "Permissions relating to the entire division",
        "vacc": "Permissions relating to the vACC that a user is a member of",
        "mentor": "Permissions relating to mentors and the training system",
        "controller": "Permissions relating to individual controllers"
    };

    let permission_checkboxes: { [key: string]: boolean } = {};

    let roles = [
        {value: "01HGR7FB0YK0D6YMHF4VW7JNFG", label: "Developer"},
        {value: "01HGR7FB0YK0D6YMHF4VW7JNFH", label: "Division Director"},
        {value: "01HGR7FB0YK0D6YMHF4VW7JNFQ", label: "Division Staff"},
    ];
    let role_dropdown_open = false;
    let value = "";
    $: selectedValue = roles.find((f) => f.value === value)?.label ?? "Select a role to edit";

    function closeAndFocusTrigger(triggerId: string) {
        role_dropdown_open = false;
        tick().then(() => {
            document.getElementById(triggerId)?.focus();
        });
    }
</script>

<div class="flex-1 space-y-4 p-8 pt-6">
    <div class="flex items-center justify-between space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">Role Editor</h2>
        <div class="flex items-center space-x-2">
            <Popover.Root bind:open={role_dropdown_open} let:ids>
                <Popover.Trigger asChild let:builder>
                    <Button builders={[builder]} variant="outline" role="combobox" aria-expanded={role_dropdown_open}
                            class="w-[200px] justify-between">
                        {selectedValue}
                        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50"></ChevronsUpDown>
                    </Button>
                </Popover.Trigger>
                <Popover.Content class="w-[200px] p-0">
                    <Command.Root>
                        <Command.Empty>No role found.</Command.Empty>
                        <Command.Group>
                            {#each roles as role}
                                <Command.Item value={role.value}
                                              onSelect={(cVal) => {value = cVal; closeAndFocusTrigger(ids.trigger)}}>
                                    <Check class={cn("mr-2 h-4 w-4",value !== role.value && "text-transparent")}/>
                                        {role.label}
                                    </Command.Item>
                                {/each}
                            </Command.Group>
                    </Command.Root>
                </Popover.Content>
            </Popover.Root>
            <Button size="sm">
                <Save class="mr-2 h-4 w-4"/>
                Save
            </Button>
        </div>
    </div>



    {#if selectedValue !== "Select a role to edit"}
        <Accordion.Root class="w-full sm-max-w-[70%]">
            {#each Object.entries(categories) as [c_id, desc]}
                <Accordion.Item value="ac-{c_id}">
                    <Accordion.Trigger>
                        <span>
                            <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            {c_id}.*
                            </code>
                             - {desc}
                        </span>
                    </Accordion.Trigger>
                    <Accordion.Content class="space-y-2">
                        {#each Object.entries(permissions) as [permission_id, v]}
                            {#if permission_id.startsWith(c_id)}
                                <div class="items-top flex space-x-2">
                                    <Checkbox bind:checked={permission_checkboxes[permission_id]}
                                          onCheckedChange={() => {permission_checkboxes = permission_checkboxes}} id={permission_id}/>
                                    <div class="grid gap-1-5 leading-none">
                                        <Label for={permission_id}
                                           class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{permission_id}</Label>
                                        <p class="text-sm text-muted-foreground">{v}</p>
                                    </div>
                                </div>
                            {/if}
                        {/each}
                    </Accordion.Content>
                </Accordion.Item>
            {/each}
        </Accordion.Root>


    {/if}

    <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
        &#123;
        {#each Object.entries(permission_checkboxes) as [permission_id, has_permission]}
            {#if has_permission}
                '{permission_id}',
            {/if}
        {/each}
        &#125;
    </code>
</div>

