<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Cog, AlertCircle } from "lucide-svelte";
    import {getAuthInfo} from "$lib/api/auth/info";
    import * as Alert from "$lib/components/ui/alert";
    import {redirectUrl} from "$lib/vatsimoauth";

    let buttonIsSpinner = false;
    let error: string | undefined = undefined;

    async function startLogin() {
        buttonIsSpinner = true;
        try {
            let auth_info = await getAuthInfo();
            window.location = redirectUrl(auth_info);
        } catch (e) {
            buttonIsSpinner = false;
            error = `The server returned an error (${e})`;
            console.error(e);
        }
    }
</script>

<div class="h-screen flex items-center justify-center">
    <img src="/login_bg_dark.png" alt="background" width="1919" height="1075" class="hidden dark:block bg_image" />
    <img src="/login_bg_light.png" alt="background" width="1919" height="1079" class="block dark:hidden bg_image" />

    <Card.Root class="w-min">
        <Card.Header>
            <Card.Title>Login to MENA HQ</Card.Title>
        </Card.Header>
        <Card.Content>
            {#if error !== undefined}
                <Alert.Root variant="destructive" class="mb-2">
                    <Alert.Title>Login Failed</Alert.Title>
                    <Alert.Description>{error}</Alert.Description>
                </Alert.Root>
            {/if}
            <Button class="w-[13em]" on:click={startLogin} bind:disabled={buttonIsSpinner}>
                {#if buttonIsSpinner}
                    <Cog class="animate-spin" />
                {:else}
                    Login with VATSIM SSO
                {/if}
            </Button>
        </Card.Content>
    </Card.Root>
</div>

<style>
    .bg_image {
        position: absolute;
        width: 100vw;
        height: 100vh;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        z-index: -1;
    }
</style>
