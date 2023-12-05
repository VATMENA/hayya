<script lang="ts">
    import {can} from "$lib/perms";
    import {Button} from "$lib/components/ui/button";

    export let page = "dashboard";

    let pages = {
        "dashboard":   ["Dashboard",           "/dashboard",                 []],
        "role_editor": ["Role Editor",         "/dashboard/role_editor",     can("system.role.create") || can("system.role.edit") || can("system.role.delete")],
        "system":      ["System Management",   "/dashboard/system",          can("system.feedback.view") || can("system.log.view") || can("system.blacklist.add") || can("system.blacklist.remove")],
        "division":    ["Division Management", "/dashboard/division/manage", can("division.details.edit") || can("division.vacc.create") || can("division.vacc.delete")],
        "vacc":        ["vACC Management",     "/dashboard/vacc/manage",     can("vacc.details.edit")],
    };
</script>

<header class="supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur">
    <div class="container flex h-14 items-center">
        <div class="mr-4 hidden md:flex">
            <a class="mr-6 flex items-center space-x-2" href="/dashboard">
                <span class="hidden font-bold sm:inline-block text-[15px] lg:text-base">MENA HQ</span>
            </a>
            <nav class="flex items-center space-x-6 text-sm font-medium">
                {#each Object.entries(pages) as [id, [name, link, visible]]}
                    {#if visible}
                        {#if page === id}
                            <a class="transition-colors hover:text-foreground/80 text-foreground" href={link}>{name}</a>
                        {:else}
                            <a class="transition-colors hover:text-foreground/80 text-foreground/60" href={link}>{name}</a>
                        {/if}
                    {/if}
                {/each}
            </nav>
        </div>
        <div class="flex flex-1 items-center justify-between space-x-2 sm:space-x-4 md:justify-end">
            <p class="mr-1 flex items-center space-x-2">
                <span class="hidden font-bold sm:inline-block text-[15px] lg:text-base">Web Eight - Developer</span>
            </p>
            <Button on:click={() => {window.localStorage.removeItem("mena-token");window.localStorage.removeItem("mena-user");window.localStorage.removeItem("mena-role");window.location.href="/"}}>Log Out</Button>
        </div>
    </div>
</header>
