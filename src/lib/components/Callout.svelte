<script lang="ts">
  import * as Alert from "$lib/components/ui/alert";
  import {
    InfoIcon,
    OctagonXIcon,
    RocketIcon,
    TriangleAlertIcon,
  } from "lucide-svelte";

  export let type: "note" | "warning" | "danger" | "tip" = "note";
  export let title: string | undefined = type
    .split("")
    .map((c, i) => (i === 0 ? c.toUpperCase() : c))
    .join("");

  const iconMap = {
    note: InfoIcon,
    tip: RocketIcon,
    warning: TriangleAlertIcon,
    danger: OctagonXIcon,
  } as const;
</script>

<Alert.Root class="mt-4" variant={type}>
  <svelte:component this={iconMap[type]} class="size-6 font-bold" />

  {#if title}
    <Alert.Title class="text-lg">
      {title}
    </Alert.Title>
  {/if}

  <Alert.Description class="leading-relaxed">
    <p>
      <slot />
    </p>
  </Alert.Description>
</Alert.Root>
