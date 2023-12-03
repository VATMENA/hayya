<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as Alert from "$lib/components/ui/alert";
    import {onMount} from "svelte";

    let error: string | undefined = undefined;

    onMount(async () => {

    })
</script>

<div class="h-screen flex items-center justify-center">
    <img src="/sunset2.jpg" alt="background" width="3840" height="2160" class="bg_image" />

    <Card.Root class="w-[20em] justify-center content-center text-center pt-5">
        <Card.Header class="space-y-0 pb-0 pt-0">
            <img src="/logos/horiz/transparent/website_discord.png" alt="VATMENA logo" class="logo_image" />
            <!--<Card.Title tag="h1">Login to MENA HQ</Card.Title>-->
        </Card.Header>
        <Card.Content>
            {#if error !== undefined}
                <Alert.Root variant="destructive" class="mb-2">
                    <Alert.Title>Login Failed</Alert.Title>
                    <Alert.Description>{error}</Alert.Description>
                </Alert.Root>
            {/if}
            <h3>Logging you in...</h3>
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
