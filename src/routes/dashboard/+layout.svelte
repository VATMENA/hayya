<script>
	import "../../app.pcss";
	import { ModeWatcher } from "mode-watcher";
	import Nav from "$lib/components/Nav.svelte";
</script>

<ModeWatcher />

<Nav></Nav>
<div
	class="flex-1 w-full bg-background shadow-lg space-y-4 p-8 pt-6 rounded-md"
>
	<slot />
</div>
