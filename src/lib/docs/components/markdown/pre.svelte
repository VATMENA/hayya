<script lang="ts">
  import CopyCodeButton from "$lib/docs/components/CopyCodeButton.svelte";
  import { cn } from "$lib/utils";
  import { createCopyCodeButton } from "$lib/docs/utils/copy-code";

  const { copyCode, copied, setCodeString } = createCopyCodeButton();
</script>

<pre use:setCodeString class="not-prose" {...$$restProps}>
	<slot />	
</pre>
<CopyCodeButton
  {copyCode}
  copied={$copied}
  class={cn("pre-copy-btn absolute right-4 top-4")} />
