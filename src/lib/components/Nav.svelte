<script lang="ts">
	import { can } from "$lib/perms";
	import { Button } from "$lib/components/ui/button";
	import { page } from "$app/stores";

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
</script>

<header
	class="sticky top-0 z-50 w-full border-b bg-background shadow-lg backdrop-blur rounded-md"
>
	<div class="flex px-8 h-14 items-center">
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
			<p class="mr-1 flex items-center space-x-2">
				<span class="hidden font-bold sm:inline-block text-[15px] lg:text-base"
					>Web Eight - Developer</span
				>
			</p>
			<Button
				on:click={() => {
					window.localStorage.removeItem("mena-token");
					window.localStorage.removeItem("mena-user");
					window.localStorage.removeItem("mena-role");
					window.location.href = "/";
				}}>Log Out</Button
			>
		</div>
	</div>
</header>
