<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  onMount(() => {
    document.cookie = `hq_token=; max-age=-1; path=/`;
    goto("/");
  });
</script>
