<script lang="ts">
    import {onMount} from "svelte";

    onMount(() => {
        window.localStorage.removeItem("menahq-token");
        window.localStorage.removeItem("menahq-user");
        window.localStorage.removeItem("menahq-role");
        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    })
</script>