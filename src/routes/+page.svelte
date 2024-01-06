<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import logo from "$lib/assets/logos/horiz/transparent/website_discord.png";
	import type { PageData } from "./$types";
	import { onMount } from "svelte";
	import {
		PUBLIC_VATSIM_OAUTH_ENDPOINT,
		PUBLIC_VATSIM_OAUTH_CLIENT_ID,
	} from "$env/static/public";

	export let data: PageData;

	async function login() {
		let callbackUrl = window.location.origin + "/callback";
		window.location = `${PUBLIC_VATSIM_OAUTH_ENDPOINT}/oauth/authorize?response_type=code&client_id=${PUBLIC_VATSIM_OAUTH_CLIENT_ID}&redirect_uri=${callbackUrl}&scope=full_name+vatsim_details`;
	}

	onMount(() => {
		if (data.loggedin) {
			window.location.href = "/dashboard";
		}
	});
</script>

<div class="h-screen flex flex-col p-6 space-y-4 items-center justify-center">
	<Card.Root class="w-[20em] justify-center content-center text-center pt-5">
		<Card.Header class="space-y-0 pb-0 pt-0">
			<img src={logo} alt="VATMENA logo" class="logo_image" />
			<!--<Card.Title tag="h1">Login to MENA HQ</Card.Title>-->
		</Card.Header>
		<Card.Content>
			<Button on:click={login}>Log in with VATSIM SSO</Button>
		</Card.Content>
	</Card.Root>
</div>
