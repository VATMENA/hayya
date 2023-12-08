<script>
	import "../../app.pcss";
	import { ModeWatcher } from "mode-watcher";
	import Nav from "$lib/components/Nav.svelte";
	import Footer from "$lib/components/Footer.svelte";
</script>

<ModeWatcher />

<Nav />
<div
	class="flex flex-col h-full overflow-auto w-full bg-background shadow-lg space-y-4 p-8 pt-6 rounded-md"
>
	<slot />
</div>
<Footer />