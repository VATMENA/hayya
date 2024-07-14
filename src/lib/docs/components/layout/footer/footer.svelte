<script lang="ts">
  import A from "$lib/docs/components/markdown/a.svelte";
  import FooterIcons from "./footer-icons.svelte";
</script>

<footer class="mt-4 border-t border-border text-sm leading-6">
  <div
    class="container flex h-16 max-w-8xl items-center justify-between gap-3 text-foreground/80">
    <div class="flex items-center gap-2 lg:flex-1">
      <A href="https://www.gnu.org/licenses/agpl-3.0.en.html">AGPL 3.0</A>
      <p>&copy; {new Date().getFullYear()} Hayya Team</p>
    </div>
    <FooterIcons />
  </div>
</footer>
