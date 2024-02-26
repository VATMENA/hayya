<script lang="ts">
  import { type UserFacilityAssignment } from "@prisma/client";
  import {
    createTable,
    Render,
    Subscribe,
    createRender,
  } from "svelte-headless-table";
  import { readable, writable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
  import DataTableUser from "./data-table-user.svelte";
  import DataTableRating from "./data-table-rating.svelte";
  import DataTableCertificates from "./data-table-certificates.svelte";
  import DataTableActions from "./data-table-actions.svelte";
  import { addPagination, addTableFilter } from "svelte-headless-table/plugins";
  import { Button } from "$lib/components/ui/button";
  import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-svelte";
  import { Input } from "$lib/components/ui/input";

  export let data: UserFacilityAssignment[];

  let store = writable(data);

  $: $store = data;

  const table = createTable(store, {
    page: addPagination(),
    filter: addTableFilter({
      fn: ({ filterValue, value }) =>
        value.toLowerCase().includes(filterValue.toLowerCase()),
    }),
  });

  const columns = table.createColumns([
    table.column({
      id: "name",
      accessor: (u) => u,
      header: "Name",
      cell: ({ value }) => {
        return createRender(DataTableUser, { userAssignment: value });
      },
      plugins: {
        filter: {
          getFilterValue: (u) => {
            return `${u.user.name} ${u.user.id}`;
          },
        },
      },
    }),
    table.column({
      id: "rating",
      accessor: (u) => u.user.ratingShort,
      header: "Rating",
      cell: ({ value }) => {
        return createRender(DataTableRating, { rating: value });
      },
      plugins: {
        filter: {
          exclude: true,
        },
      },
    }),
    table.column({
      accessor: (u) => u,
      header: "Certificates",
      cell: ({ value }) => {
        return createRender(DataTableCertificates, {
          heldCertificates: value.user.heldCertificates,
          holder: value.user,
        });
      },
      plugins: {
        filter: {
          exclude: true,
        },
      },
    }),
    table.column({
      accessor: (u) => u,
      header: "",
      cell: ({ value }) => {
        return createRender(DataTableActions, { user: value });
      },
      plugins: {
        filter: {
          exclude: true,
        },
      },
    }),
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
    table.createViewModel(columns);

  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
  const { filterValue } = pluginStates.filter;
</script>

<div>
  <div class="flex items-center py-4">
    <Input
      class="max-w-sm"
      placeholder="Search by name..."
      type="text"
      bind:value={$filterValue} />
  </div>
  <div class="rounded-md border">
    <Table.Root {...$tableAttrs}>
      <Table.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                  <Table.Head {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Head>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Header>
      <Table.Body {...$tableBodyAttrs}>
        {#each $pageRows as row (row.id)}
          <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
            <Table.Row {...rowAttrs}>
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <Table.Cell {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Cell>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
  <div class="flex items-center justify-end space-x-2 py-4">
    <Button
      variant="outline"
      size="sm"
      on:click={() => ($pageIndex = $pageIndex - 1)}
      disabled={!$hasPreviousPage}>
      Previous
    </Button>
    <Button
      variant="outline"
      size="sm"
      disabled={!$hasNextPage}
      on:click={() => ($pageIndex = $pageIndex + 1)}>
      Next
    </Button>
  </div>
</div>
