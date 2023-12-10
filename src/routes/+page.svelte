<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";

    import logo from "$lib/assets/logos/horiz/transparent/website_discord.png";
    import type { PageData } from "./$types";
    import {onMount} from "svelte";

    export let data: PageData;

    async function login() {
        let location = window.location.origin + "/callback";
        window.location = `${data.json.vatsim_endpoint}/oauth/authorize?response_type=code&client_id=${data.json.client_id}&redirect_uri=${location}&scope=full_name+vatsim_details`;
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
            <img src={logo} alt="VATMENA logo" class="logo_image"/>
            <!--<Card.Title tag="h1">Login to MENA HQ</Card.Title>-->
        </Card.Header>
        <Card.Content>
            <Button on:click={login}>Log in with VATSIM SSO</Button>
        </Card.Content>
    </Card.Root>
</div>
