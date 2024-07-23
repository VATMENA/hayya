<script lang="ts">
  import { version } from "$app/environment";
</script>

<div
  class="flex h-screen flex-col items-center justify-center space-y-4 bg-[url('/sunset2.jpg')] bg-cover bg-no-repeat p-6">
  <slot />
</div>

<p class="fixed bottom-1 left-1 text-xs">
  Hayya {version}
</p>

<p class="fixed bottom-1 right-1 text-xs">
  Made with &lt;3 by core, sharif_, hhhapz, and iconoclastic_
</p>
