<script lang="ts">
  import { blurhashToCssGradientString } from "@unpic/placeholder";

  export let alt: string;
  export let src: string;
  export let width: string | null | undefined = undefined;
  export let height: string | null | undefined = undefined;
  export let blurhash: string | null | undefined = undefined;
  export let priority: boolean = false;

  let props: any = $$restProps;

  $: {
      if (priority) {
          props.loading ||= "eager";
          props.fetchpriority ||= "high";
      } else {
          props.loading ||= "lazy";
          props.decoding ||= "async";
      }

      if (props.alt === "") {
          props.role ||= "presentation";
      }

      let style = '';

      if (width) {
          style += `width: ${width};`;
      }
      if (height) {
          style += `height: ${height};`;
      }

      if (blurhash) {
          let bg = blurhashToCssGradientString(blurhash);
          style += `background-image: ${bg};`;
      }

      props.style += style;
  }
</script>

<img {src} {alt} {width} {height} {...props} on:error={null} />