<script lang="ts">
  import { Image } from "@unpic/svelte";
  import { blurhashToCssGradientString } from "@unpic/placeholder";

  export let blurhash: string | undefined = undefined;

  let background: string | undefined = undefined;

  $: {
    if (blurhash) {
      background = blurhashToCssGradientString(blurhash);
    }
  }
</script>

<Image {background} width={500} height={281} {...$$restProps} />
