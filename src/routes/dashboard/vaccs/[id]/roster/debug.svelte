<script lang="ts">
  import { getForm } from "formsnap";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";

  const { form } = getForm();
</script>

<SuperDebug data={$form} />
