<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import { setContext } from "svelte";
  import type { LayoutData } from "./$types";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb";
  import { BreadcrumbItem } from "$lib/components/ui/breadcrumb";
  import { items } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  export let data: LayoutData;

  setContext("roles", data.roles);
  setContext("user", data.user);
</script>

<Nav />
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
