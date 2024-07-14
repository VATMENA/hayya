<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import logo from "$lib/assets/logos/horiz/transparent/website_discord.png";
  import {
    PUBLIC_VATSIM_OAUTH_ENDPOINT,
    PUBLIC_VATSIM_OAUTH_CLIENT_ID,
  } from "$env/static/public";

  async function login() {
    let callbackUrl = window.location.origin + "/callback";
    // @ts-ignore
    window.location = `${PUBLIC_VATSIM_OAUTH_ENDPOINT}/oauth/authorize?response_type=code&client_id=${PUBLIC_VATSIM_OAUTH_CLIENT_ID}&redirect_uri=${callbackUrl}&scope=full_name+vatsim_details`;
  }
</script>

<div class="flex h-screen flex-col items-center justify-center space-y-4 p-6">
  <Card.Root class="w-[20em] content-center justify-center pt-5 text-center">
    <Card.Header class="space-y-0 pb-0 pt-0">
      <img src={logo} alt="VATMENA logo" class="logo_image" />
      <!--<Card.Title tag="h1">Login to MENA HQ</Card.Title>-->
    </Card.Header>
    <Card.Content>
      <Button on:click={login}>Log in with VATSIM SSO</Button>
    </Card.Content>
  </Card.Root>
</div>
