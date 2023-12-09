<script>
	import "../app.pcss";
	import { ModeWatcher } from "mode-watcher";
	import Footer from "$lib/components/Footer.svelte";
</script>

<ModeWatcher />
<div
	class="h-screen flex flex-col p-6 space-y-4 bg-[url('/sunset2.jpg')] bg-cover bg-no-repeat items-center justify-center"
>
	<slot />
</div>
<Footer />