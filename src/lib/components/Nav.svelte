<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { page } from "$app/stores";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Avatar from "$lib/components/ui/avatar";
  import Github from "lucide-svelte/icons/github";
  import LifeBuoy from "lucide-svelte/icons/life-buoy";
  import LogOut from "lucide-svelte/icons/log-out";
  import Cloud from "lucide-svelte/icons/cloud";
  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";
  import SunMoon from "lucide-svelte/icons/sun-moon";
  import ServerCog from "lucide-svelte/icons/server-cog";
  import BookIcon from "lucide-svelte/icons/book";
  import ServerIcon from "lucide-svelte/icons/server";
  import { setMode, resetMode } from "mode-watcher";
  import { can } from "$lib/perms/can";
  import { Badge } from "$lib/components/ui/badge";
  import { EDIT_DETAILS } from "$lib/perms/permissions";
  import { color } from "$lib/colors";

  type Page = {
    [pageId: string]: {
      name: string;
      link: string;
      visible: boolean;
    };
  };

  const pages: Page = {
    training: {
      name: "Training",
      link: `/${$page.data.facility.id}/training`,
      visible: true,
    },
    events: {
      name: "Events",
      link: `/${$page.data.facility.id}/events`,
      visible: true,
    },
    roster: {
      name: "Roster",
      link: `/${$page.data.facility.id}/roster`,
      visible: true,
    },
    manage: {
      name: "Manage vACC",
      link: `/${$page.data.facility.id}/manage`,
      visible: can(EDIT_DETAILS),
    },
    resources: {
      name: "Resources",
      link: `/${$page.data.facility.id}/resources`,
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
    return `https://avatar.vercel.sh/${name}`;
  }
</script>

<header
  class="sticky top-0 z-50 w-full border-b bg-background shadow-lg backdrop-blur rounded-md">
  <div class="flex p-8 h-14 items-center">
    <div class="mr-4 hidden md:flex">
      <a
        class="mr-6 flex items-center space-x-2"
        href="/{$page.data.facility.id}">
        <span class="hidden font-bold sm:inline-block text-[15px] lg:text-base">
          {$page.data.facility.name} HQ
        </span>
      </a>
      <nav class="flex items-center space-x-6 text-sm font-medium">
        {#each Object.entries(pages) as [_, { name, link, visible }]}
          {#if visible}
            {#if $page.url.pathname.startsWith(link)}
              <a
                class="transition-colors hover:text-foreground/80 text-foreground"
                href={link}>
                {name}
              </a>
            {:else}
              <a
                class="transition-colors hover:text-foreground/80 text-foreground/60"
                href={link}>
                {name}
              </a>
            {/if}
          {/if}
        {/each}
      </nav>
    </div>
    <div
      class="flex flex-1 items-center justify-between space-x-2 sm:space-x-4 md:justify-end">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button
            builders={[builder]}
            variant="outline"
            class="mr-1 flex items-center space-x-2">
            {#if $page.data.user !== null && $page.data.roles !== null}
              <Avatar.Root class="mr-2 h-5 w-5">
                <Avatar.Image src={avatar($page.data.user.name)} />
                <Avatar.Fallback>
                  {initials($page.data.user.name)}
                </Avatar.Fallback>
              </Avatar.Root>
              <span
                class="hidden font-bold sm:inline-block text-[15px] lg:text-base">
                {$page.data.user.name}
              </span>
            {:else}
              <span
                class="hidden font-bold sm:inline-block text-[15px] lg:text-base">
                User Info
              </span>
            {/if}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-56">
          <DropdownMenu.Label>
            {$page.data.user.name}
            {#if $page.data.roles !== null}
              {#each $page.data.roles as role}
                {#each $page.data.facility.roles as possibleRole}
                  {#if role.id === possibleRole.id}
                    <Badge style="background-color: {color(role.color)}">
                      {possibleRole.name}
                    </Badge>
                  {/if}
                {/each}
              {/each}
            {/if}
          </DropdownMenu.Label>

          <DropdownMenu.Separator />

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <SunMoon class="mr-2 h-4 w-4" />
              <span>Theme</span>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item
                on:click={() => {
                  setMode("light");
                }}>
                <Sun class="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                on:click={() => {
                  setMode("dark");
                }}>
                <Moon class="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                on:click={() => {
                  resetMode();
                }}>
                <SunMoon class="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator />

          <DropdownMenu.Group>
            <DropdownMenu.Item href="/switch_hq">
              <ServerCog class="mr-2 h-4 w-4" />
              <span>Change HQ</span>
            </DropdownMenu.Item>
          </DropdownMenu.Group>

          <DropdownMenu.Separator />

          <DropdownMenu.Group>
            <DropdownMenu.Item href="https://github.com/VATMENA/hayya">
              <Github class="mr-2 h-4 w-4" />
              <span>GitHub</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item href="/dashboard/support">
              <LifeBuoy class="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item href="/dashboard/api">
              <Cloud class="mr-2 h-4 w-4" />
              <span>API</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item href="https://docs.hayya.vatsim.me">
              <BookIcon class="mr-2 h-4 w-4" />
              <span>Documentation</span>
            </DropdownMenu.Item>
          </DropdownMenu.Group>

          <DropdownMenu.Separator />

          {#if $page.data.user.isSiteAdmin}
            <DropdownMenu.Item href="/admin/">
              <ServerIcon class="mr-2 h-4 w-4" />
              <span>Site Administration</span>
            </DropdownMenu.Item>

            <DropdownMenu.Separator />
          {/if}

          <DropdownMenu.Item href="/logout">
            <LogOut class="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </div>
</header>
