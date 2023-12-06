<script>
    import { Button } from "$lib/components/ui/button";
    import { Save } from "lucide-svelte";
    import "../../app.pcss";
    import { ModeWatcher } from "mode-watcher";
    import Nav from "$lib/components/Nav.svelte";
</script>

<ModeWatcher />


<div class="flex-col md:flex">
    <Nav></Nav>
    <slot></slot>
</div>



