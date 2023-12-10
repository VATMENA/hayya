<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import {page} from "$app/stores";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import * as Avatar from "$lib/components/ui/avatar";
    import {Github, LifeBuoy, LogOut, Cloud, Sun, Moon, SunMoon} from "lucide-svelte";
    import {setMode, resetMode} from "mode-watcher";
    import {can} from "$lib/perms";

    type Page = {
        [pageId: string]: {
            name: string;
            link: string;
            visible: boolean;
        };
    };

    const pages: Page = {
        dashboard: {
            name: "Dashboard",
            link: "/dashboard",
            visible: true,
        },
        role_editor: {
            name: "Role Editor",
            link: "/dashboard/role_editor",
            visible: can($page.data.roles, ["system.role.create", "system.role.edit", "system.role.delete"])
        },
        system: {
            name: "System Management",
            link: "/dashboard/system",
            visible: can($page.data.roles, ["system.feedback.view", "system.log.view", "system.blacklist.add", "system.blacklist.remove"])
        },
        division: {
            name: "Division Management",
            link: "/dashboard/division/manage",
            visible: can($page.data.roles, ["division.details.edit", "division.vacc.create", "division.vacc.delete"]),
        },
        vacc: {
            name: "vACC Management",
            link: "/dashboard/vacc/manage",
            visible: can($page.data.roles, "vacc.details.edit"),
        },
        rosters: {
            name: "Rosters",
            link: "/dashboard/division/rosters",
            visible: true,
        },
    };

    function initials(name: string): string {
        let inis = "";

        for (let name_part of name.split(" ")) {
            inis += name_part[0];
        }

        return inis;
    }

    function avatar(name: string): string {
        return `https://avatar.vercel.sh/${name}`
    }
</script>

<header
        class="sticky top-0 z-50 w-full border-b bg-background shadow-lg backdrop-blur rounded-md"
>
    <div class="flex p-8 h-14 items-center">
        <div class="mr-4 hidden md:flex">
            <a class="mr-6 flex items-center space-x-2" href="/dashboard">
				<span class="hidden font-bold sm:inline-block text-[15px] lg:text-base"
                >MENA HQ</span
                >
            </a>
            <nav class="flex items-center space-x-6 text-sm font-medium">
                {#each Object.entries(pages) as [_, {name, link, visible}]}
                    {#if visible}
                        {#if $page.url.pathname === link}
                            <a
                                    class="transition-colors hover:text-foreground/80 text-foreground"
                                    href={link}>{name}</a
                            >
                        {:else}
                            <a
                                    class="transition-colors hover:text-foreground/80 text-foreground/60"
                                    href={link}>{name}</a
                            >
                        {/if}
                    {/if}
                {/each}
            </nav>
        </div>
        <div
                class="flex flex-1 items-center justify-between space-x-2 sm:space-x-4 md:justify-end"
        >

            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild let:builder>
                    <Button builders={[builder]} variant="outline" class="mr-1 flex items-center space-x-2">
                        {#if $page.data.user !== null && $page.data.roles !== null}
                            <Avatar.Root class="mr-2 h-5 w-5">
                                <Avatar.Image src={avatar($page.data.user.name_full)}/>
                                <Avatar.Fallback>{initials($page.data.user.name_full)}</Avatar.Fallback>
                            </Avatar.Root>
                            <span class="hidden font-bold sm:inline-block text-[15px] lg:text-base">{$page.data.user.name_full}</span>
                        {:else}
                            <span class="hidden font-bold sm:inline-block text-[15px] lg:text-base">User Info</span>
                        {/if}
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="w-56">
                    <DropdownMenu.Label>{$page.data.user.name_full}</DropdownMenu.Label>
                    <DropdownMenu.Label
                            class="font-normal text-foreground/60">{$page.data.user.vacc === null ? "No vACC" : $page.data.user.vacc}</DropdownMenu.Label>
                    {#if $page.data.roles !== null}
                        {#each $page.data.roles as role}
                            <DropdownMenu.Label class="font-normal text-foreground/60">{role.name}</DropdownMenu.Label>
                        {/each}
                    {/if}

                    <DropdownMenu.Separator/>

                    <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger>
                            <SunMoon class="mr-2 h-4 w-4"/>
                            <span>Theme</span>
                        </DropdownMenu.SubTrigger>
                        <DropdownMenu.SubContent>
                            <DropdownMenu.Item on:click={() => {setMode("light");}}>
                                <Sun class="mr-2 h-4 w-4"/>
                                <span>Light</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item on:click={() => {setMode("dark");}}>
                                <Moon class="mr-2 h-4 w-4"/>
                                <span>Dark</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item on:click={() => {resetMode();}}>
                                <SunMoon class="mr-2 h-4 w-4"/>
                                <span>System</span>
                            </DropdownMenu.Item>
                        </DropdownMenu.SubContent>
                    </DropdownMenu.Sub>

                    <DropdownMenu.Separator/>

                    <DropdownMenu.Group>
                        <DropdownMenu.Item href="https://github.com/VATMENA/hayya">
                            <Github class="mr-2 h-4 w-4"/>
                            <span>GitHub</span>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item href="/dashboard/support">
                            <LifeBuoy class="mr-2 h-4 w-4"/>
                            <span>Support</span>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item href="/dashboard/api">
                            <Cloud class="mr-2 h-4 w-4"/>
                            <span>API</span>
                        </DropdownMenu.Item>
                    </DropdownMenu.Group>

                    <DropdownMenu.Separator/>

                    <DropdownMenu.Item href="/logout">
                        <LogOut class="mr-2 h-4 w-4"/>
                        <span>Log out</span>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    </div>
</header>
