<script lang="ts">
    import {marked} from "marked";

    export let src: string;

    let output: string | Promise<string>;

    $: {
        output = marked(src.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,""))
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

<style lang="postcss">
    .render :global(h1) {
        scroll-margin: 5rem;
        font-size: 2.25rem; /* 36px */
        line-height: 2.5rem; /* 40px */
        font-weight: 800;
        letter-spacing: -0.025em;
    }
    .render :global(h2) {
        scroll-margin: 5rem;
        font-size: 1.875rem; /* 30px */
        line-height: 2.25rem; /* 36px */
        font-weight: 700;
        letter-spacing: -0.025em;
    }
    .render :global(h3) {
        scroll-margin: 5rem;
        font-size: 1.5rem; /* 24px */
        line-height: 2rem; /* 32px */
        font-weight: 600;
        letter-spacing: -0.025em;
    }
    .render :global(h4) {
        scroll-margin: 5rem;
        font-size: 1.25rem; /* 20px */
        line-height: 1.75rem; /* 28px */
        font-weight: 500;
        letter-spacing: -0.025em;
    }
    .render :global(a) {
        font-weight: 500;
        text-decoration: underline;
        text-underline-offset: 4px;
    }
</style>
