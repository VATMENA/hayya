<script lang="ts">
    import {page} from "$app/stores";
    import Image from "$lib/components/Image.svelte";

    export let eventId: string;
    export let bannerUrl: string;
    export let blurhash: string;
</script>

<a href="/dashboard/vaccs/{$page.params.id}/events/{eventId}/">
    <Image
            width="480px"
            class="rounded"
            src={bannerUrl}
            {blurhash}
            style="aspect-ratio: 16/9;"
            alt="" />
</a>