<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Cog } from "lucide-svelte";
	import { getAuthInfo } from "$lib/api/auth/info";
	import * as Alert from "$lib/components/ui/alert";
	import { redirectUrl } from "$lib/vatsimoauth";

	let buttonIsSpinner = false;
	let error: string | undefined = undefined;

	async function startLogin() {
		buttonIsSpinner = true;
		try {
			let auth_info = await getAuthInfo();
			window.location.href = redirectUrl(auth_info);
		} catch (e) {
			buttonIsSpinner = false;
			error = `The server returned an error (${e})`;
			console.error(e);
		}
	}
</script>

<Card.Root class="w-[20em] justify-center content-center text-center pt-5">
	<Card.Header class="space-y-0 pb-0 pt-0">
		<img
			src="/logos/horiz/transparent/website_discord.png"
			alt="VATMENA logo"
			class="logo_image"
		/>
		<!--<Card.Title tag="h1">Login to MENA HQ</Card.Title>-->
	</Card.Header>
	<Card.Content>
		{#if error !== undefined}
			<Alert.Root variant="destructive" class="mb-2">
				<Alert.Title>Login Failed</Alert.Title>
				<Alert.Description>{error}</Alert.Description>
			</Alert.Root>
		{/if}
		<Button
			class="w-[15em] mt-0"
			on:click={startLogin}
			bind:disabled={buttonIsSpinner}
		>
			{#if buttonIsSpinner}
				<Cog class="animate-spin" />
			{:else}
				Login with VATSIM SSO
			{/if}
		</Button>
	</Card.Content>
</Card.Root>
