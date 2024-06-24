<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import logo from "$lib/assets/logos/horiz/transparent/website_discord.png";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="flex h-full flex-col items-center justify-center space-y-4 p-6">
  <Card.Root class="w-[20em] content-center justify-center pt-5 text-center">
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
