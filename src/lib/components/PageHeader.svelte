<script lang="ts">
  export let title = "";
</script>

<div class="flex items-center justify-between space-y-2 pb-4">
  <h2 class="text-3xl font-bold tracking-tight">{title}</h2>
  <slot />
</div>
