<script lang="ts">
  import "../app.pcss";
  import { ModeWatcher } from "mode-watcher";
</script>

<!-- Dark mode -->
<ModeWatcher />

<div
  class="h-screen flex flex-col p-6 space-y-4 bg-[url('/sunset2.jpg')] bg-cover bg-no-repeat items-center justify-center">
  <slot />
</div>

<p class="text-xs fixed right-1 bottom-1">
  Made with &lt;3 by core, sharif_, and liam
</p>
