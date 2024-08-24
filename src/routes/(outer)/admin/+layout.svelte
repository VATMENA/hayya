<script>
  import { items } from "$lib/breadcrumbs";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb";
</script>

<div
  class="flex h-full w-full flex-col space-y-1 overflow-auto rounded-md bg-background p-8 pt-4 shadow-lg">
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
