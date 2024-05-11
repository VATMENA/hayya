<script lang="ts">
  import { marked } from "marked";

  export let src: string;

  let output: string | Promise<string>;

  $: {
    output = marked(src.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ""));
  }
</script>

{#await output}
  Rendering, please wait...
{:then output}
  <div class="render">
    {@html output}
  </div>
{:catch error}
  Error rendering: {error}
{/await}
