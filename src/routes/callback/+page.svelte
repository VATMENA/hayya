<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import logo from "$lib/assets/logos/horiz/transparent/website_discord.png";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="h-screen flex flex-col p-6 space-y-4 items-center justify-center">
  <Card.Root class="w-[20em] justify-center content-center text-center pt-5">
    <Card.Header class="space-y-0 pb-0 pt-0">
      <img src={logo} alt="VATMENA logo" class="logo_image" />
      <!--<Card.Title tag="h1">Login to MENA HQ</Card.Title>-->
    </Card.Header>
    <Card.Content>
      {#if data.err !== undefined}
        <p>Error: {data.err}</p>
      {/if}
      <p>Logging you in...</p>
    </Card.Content>
  </Card.Root>
</div>
