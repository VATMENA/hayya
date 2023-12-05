<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as Alert from "$lib/components/ui/alert";
    import { Button } from "$lib/components/ui/button";
    import {onMount} from "svelte";
    import {authWithVatsimCode} from "$lib/api/auth/token";

    let error: string | undefined = undefined;

    onMount(async () => {
        let search_params = new URLSearchParams(window.location.search);
        if (!search_params.has("code")) {
            error = "URL missing 'code' parameter.";
            return;
        }
        try {
            let auth_resp = await authWithVatsimCode(search_params.get("code")!);
            console.log(auth_resp);
            window.localStorage.setItem("menahq-token", auth_resp.token);
            window.localStorage.setItem("menahq-user", JSON.stringify(auth_resp.user));
            window.localStorage.setItem("menahq-role", JSON.stringify(auth_resp.role));
            window.location.href = "/dashboard";
        } catch (e) {
            error = `Login failed (${e})`;
        }
    })
</script>

<div class="h-screen flex items-center justify-center">
    <img src="/sunset2.jpg" alt="background" width="3840" height="2160" class="bg_image" />

    <Card.Root class="w-[20em] justify-center content-center text-center pt-5">
        <Card.Header class="space-y-0 pb-0 pt-0">
            <img src="/logos/horiz/transparent/website_discord.png" alt="VATMENA logo" class="logo_image" />
        </Card.Header>
        <Card.Content>
            {#if error !== undefined}
                <Alert.Root variant="destructive" class="mb-2">
                    <Alert.Title>Login Failed</Alert.Title>
                    <Alert.Description>{error}</Alert.Description>
                </Alert.Root>
                <Button on:click={() => {window.location.href = "/"}}>Return to Login</Button>
            {:else}
                <h3>Logging you in...</h3>
            {/if}
        </Card.Content>
    </Card.Root>
</div>

<style>
    .bg_image {
        position: absolute;
        object-fit: cover;
        min-width: 100%;
        min-height: 100%;
        width: 100%;
        height: 100%;
        z-index: -1;
        aspect-ratio: 16/9;
        overflow: hidden;
    }
    .logo_image {
        object-fit: cover;
        height: 100px;
        margin: 0;
    }
</style>
