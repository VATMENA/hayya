<script context="module">
  import {
    a,
    blockquote,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    hr,
    img,
    li,
    ol,
    p,
    pre,
    table,
    td,
    th,
    tr,
    ul,
  } from "$lib/docs/components/markdown/index.js";

  export {
    a,
    blockquote,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    hr,
    img,
    li,
    ol,
    p,
    pre,
    table,
    td,
    th,
    tr,
    ul,
  };
</script>

<script lang="ts">
  import "$lib/docs/styles/markdown.pcss";
  export let title = "";
  export let description = "";
</script>

<slot {title} {description} />
