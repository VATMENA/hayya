<script lang="ts">
    import * as Card from "$lib/components/ui/card";

    import logo from "$lib/assets/logos/horiz/transparent/website_discord.png";
    import {onMount} from "svelte";
    import {endpoint} from "$lib/api";
    import {page} from "$app/stores";

    let err: string | null = null;

    onMount(async () => {
        try {
            let res = await fetch(endpoint("/api/auth/token"), {
                method: 'POST',
                body: JSON.stringify({
                    code: $page.url.searchParams.get("code"),
                    redirect_uri: window.location.origin + "/callback"
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!res.ok) {
                console.log("server returned error response");
                err = "server returned error response";
                return;
            }
            let rj = await res.json();
            console.log(rj);
            document.cookie = `hqt=${rj.token}; max-age=15552000; path=/`;
            window.location.href = "/dashboard";
        } catch (e) {
            err = e;
            return;
        }
    })
</script>

<div class="h-screen flex flex-col p-6 space-y-4 items-center justify-center">
    <Card.Root class="w-[20em] justify-center content-center text-center pt-5">
        <Card.Header class="space-y-0 pb-0 pt-0">
            <img src={logo} alt="VATMENA logo" class="logo_image"/>
            <!--<Card.Title tag="h1">Login to MENA HQ</Card.Title>-->
        </Card.Header>
        <Card.Content>
            {#if err !== null}
                <p>Error: {err}</p>
            {/if}
            <p>Logging you in...</p>
        </Card.Content>
    </Card.Root>
</div>
