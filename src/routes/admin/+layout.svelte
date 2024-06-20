<script>
  import { items } from "$lib/breadcrumbs";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb";
</script>

<div
  class="flex flex-col h-full overflow-auto w-full bg-background shadow-lg p-8 pt-4 space-y-1 rounded-md">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      {#each $items as item, i}
        {#if i !== 0}
          <Breadcrumb.Separator />
        {/if}
        <Breadcrumb.Item>
          {#if item.link !== null}
            <Breadcrumb.Link href={item.link}>{item.display}</Breadcrumb.Link>
          {:else}
            <Breadcrumb.Page>{item.display}</Breadcrumb.Page>
          {/if}
        </Breadcrumb.Item>
      {/each}
    </Breadcrumb.List>
  </Breadcrumb.Root>

  <slot />
</div>
