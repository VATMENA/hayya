<script>
  import logo from "$lib/assets/logos/horiz/transparent/website_discord.png";
  import * as Card from "$lib/components/ui/card";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  onMount(async () => {
    await fetch("?", {
      method: "POST",
      body: "",
    });
    await goto("/");
  });
</script>

<div class="flex h-full flex-col items-center justify-center space-y-4 p-6">
  <Card.Root class="w-[20em] content-center justify-center pt-5 text-center">
    <Card.Header class="space-y-0 pb-0 pt-0">
      <img src={logo} alt="VATMENA logo" class="logo_image" />
      <!--<Card.Title tag="h1">Login to MENA HQ</Card.Title>-->
    </Card.Header>
    <Card.Content>
      <p>Logging you out, please wait...</p>
    </Card.Content>
  </Card.Root>
</div>
