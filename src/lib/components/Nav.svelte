<script lang="ts">
	import {can, role, user} from "$lib/perms";
	import { Button } from "$lib/components/ui/button";
	import { page } from "$app/stores";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Avatar from "$lib/components/ui/avatar";
	import {Github, LifeBuoy, LogOut, Cloud, Sun, Moon, SunMoon} from "lucide-svelte";
	import { setMode, resetMode } from "mode-watcher";

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
			visible:
				can("system.role.create") ||
				can("system.role.edit") ||
				can("system.role.delete"),
		},
		system: {
			name: "System Management",
			link: "/dashboard/system",
			visible:
				can("system.feedback.view") ||
				can("system.log.view") ||
				can("system.blacklist.add") ||
				can("system.blacklist.remove"),
		},
		division: {
			name: "Division Management",
			link: "/dashboard/division/manage",
			visible:
				can("division.details.edit") ||
				can("division.vacc.create") ||
				can("division.vacc.delete"),
		},
		vacc: {
			name: "vACC Management",
			link: "/dashboard/vacc/manage",
			visible: can("vacc.details.edit"),
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
				{#each Object.entries(pages) as [_, { name, link, visible }]}
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
						{#if user() !== null && role() !== null}
							<Avatar.Root class="mr-2 h-5 w-5">
								<Avatar.Image src={avatar(user().name_full)}/>
								<Avatar.Fallback>{initials(user().name_full)}</Avatar.Fallback>
							</Avatar.Root>
							<span class="hidden font-bold sm:inline-block text-[15px] lg:text-base">{user().name_full} - {role().name}</span>
						{:else}
							<span class="hidden font-bold sm:inline-block text-[15px] lg:text-base">User Info</span>
						{/if}
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-56">
					<DropdownMenu.Label>{user().name_full}</DropdownMenu.Label>
					<DropdownMenu.Label class="font-normal text-foreground/60">{role().name} - {user().vacc === null ? "No vACC" : user().vacc}</DropdownMenu.Label>

					<DropdownMenu.Separator />

					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger>
							<SunMoon class="mr-2 h-4 w-4" />
							<span>Theme</span>
						</DropdownMenu.SubTrigger>
						<DropdownMenu.SubContent>
							<DropdownMenu.Item on:click={() => {setMode("light");}}>
								<Sun class="mr-2 h-4 w-4" />
								<span>Light</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item on:click={() => {setMode("dark");}}>
								<Moon class="mr-2 h-4 w-4" />
								<span>Dark</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item on:click={() => {resetMode();}}>
								<SunMoon class="mr-2 h-4 w-4" />
								<span>System</span>
							</DropdownMenu.Item>
						</DropdownMenu.SubContent>
					</DropdownMenu.Sub>

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
					</DropdownMenu.Group>

					<DropdownMenu.Separator />

					<DropdownMenu.Item href="/logout">
						<LogOut class="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
</header>
