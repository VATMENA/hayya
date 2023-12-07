<script lang="ts">
	import * as Tabs from "$lib/components/ui/tabs";
	import * as Card from "$lib/components/ui/card";
	import * as Table from "$lib/components/ui/table";
	import * as Alert from "$lib/components/ui/alert";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { Badge } from "$lib/components/ui/badge";
	import { onMount } from "svelte";
	import { getHomeRoster } from "$lib/api/roster/home";
	import type { RosterUser } from "$lib/api/roster/home";
	import {
		ROLE_CONTROLLER_ID,
		ROLE_DEVELOPER_ID,
		ROLE_DIVISION_DIRECTOR_ID,
		ROLE_DIVISION_STAFF_ID,
		ROLE_MENTOR_ID,
		ROLE_VACC_DIRECTOR_ID,
		ROLE_VACC_STAFF_ID,
	} from "$lib/roles";

	let home_users: RosterUser[] = [];
	let error: string | null = null;

	onMount(async () => {
		try {
			home_users = (await getHomeRoster()).users;
		} catch (e) {
			error = `The server returned an error (${e})`;
			console.error(e);
		}
	});
</script>

<div class="flex items-center justify-between space-y-2">
	<h2 class="text-3xl font-bold tracking-tight">Division Roster</h2>
</div>

<Alert.Root>
	<Alert.Title>Heads up!</Alert.Title>
	<Alert.Description>
		Rosters are updated hourly. If information is outdated, check back later!
	</Alert.Description>
</Alert.Root>

{#if error != null}
	<Alert.Root variant="destructive">
		<Alert.Title>Failed to load a roster</Alert.Title>
		<Alert.Description>
			{error}
		</Alert.Description>
	</Alert.Root>
{/if}

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
			<Card.Content class="space-y-2">
				<Alert.Root>
					<Alert.Title>Heads up!</Alert.Title>
					<Alert.Description>
						Members who do not hold a rating (OBS/Observers) and are not members
						of any vACC are omitted for brevity.
					</Alert.Description>
				</Alert.Root>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Name</Table.Head>
							<Table.Head>Rating</Table.Head>
							<Table.Head>vACC</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if home_users.length === 0}
							<Table.Row>
								<Table.Cell>
									<Skeleton class="h-4"></Skeleton>
								</Table.Cell>
								<Table.Cell><Skeleton class="h-4"></Skeleton></Table.Cell>
								<Table.Cell><Skeleton class="h-4"></Skeleton></Table.Cell>
							</Table.Row>
						{/if}
						{#each home_users as user}
							{#if user.role === ROLE_CONTROLLER_ID && user.vacc == null && user.rating === "OBS"}
								<!-- skip -->
							{:else}
								<Table.Row>
									<Table.Cell>
										{user.name_first}
										{user.name_last}
										{#if user.role === ROLE_DEVELOPER_ID}
											<Badge class="bg-fuchsia-500">Developer</Badge>
										{:else if user.role === ROLE_DIVISION_DIRECTOR_ID}
											<Badge class="bg-red-500">Division Director</Badge>
										{:else if user.role === ROLE_DIVISION_STAFF_ID}
											<Badge class="bg-orange-500">Division Staff</Badge>
										{:else if user.role === ROLE_VACC_DIRECTOR_ID}
											<Badge class="bg-emerald-500">vACC Director</Badge>
										{:else if user.role === ROLE_VACC_STAFF_ID}
											<Badge class="bg-green-500">vACC Staff</Badge>
										{:else if user.role === ROLE_MENTOR_ID}
											<Badge class="bg-sky-500">Mentor</Badge>
										{/if}
									</Table.Cell>
									<Table.Cell>{user.rating}</Table.Cell>
									<Table.Cell
										>{user.vacc == null ? "N/A" : user.vacc}</Table.Cell
									>
								</Table.Row>
							{/if}
						{/each}
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

			<Card.Content class="space-y-2"></Card.Content>
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

			<Card.Content class="space-y-2"></Card.Content>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
