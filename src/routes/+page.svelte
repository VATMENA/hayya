<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
</script>

<div class="h-screen flex items-center justify-center">
    <Card.Root class="w-min">
        <Card.Header>
            <Card.Title>Login to MENA HQ</Card.Title>
        </Card.Header>
        <Card.Content>
            <Button>Login with VATSIM SSO</Button>
        </Card.Content>
    </Card.Root>
</div>

<style>
    :global(body) {
        background-image: url("/login_bg.png");
        background-size: cover;
    }
</style>