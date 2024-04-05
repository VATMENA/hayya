<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "$lib/components/ui/table";
  import type { EventSignup, User } from "@prisma/client";
  import {
    Render,
    Subscribe,
    createRender,
    createTable,
  } from "svelte-headless-table";
  import {
    addColumnFilters,
    addPagination,
    addSortBy,
  } from "svelte-headless-table/plugins";
  import { readable } from "svelte/store";
  import DataTableCertificates from "../../../roster/data-table-certificates.svelte";
  import DataTableRating from "../../../roster/data-table-rating.svelte";

  export let signups: any;

  const table = createTable(readable(signups), {
    page: addPagination(),
  });

  const columns = table.createColumns([
    table.column({
      header: "Name",
      accessor: ({ user }) => user.name,
    }),
    table.column({
      header: "CID",
      accessor: "userId",
    }),
    table.column({
      header: "Rating",
      accessor: ({ user }: User) => user.ratingShort,
      cell: ({ value }) => {
        return createRender(DataTableRating, { rating: value });
      },
    }),
    table.column({
      header: "Certificates",
      accessor: (user: User) => user,
      cell: ({ value }) => {
        return createRender(DataTableCertificates, {
          heldCertificates: value.user.heldCertificates,
          holder: value.user,
        });
      },
    }),
    table.column({
      header: "Desired position",
      accessor: "desiredPosition",
    }),
    table.column({
      header: "Available from",
      accessor: (signup: EventSignup) =>
        signup.availableFrom.toLocaleTimeString(),
    }),
    table.column({
      header: "Available until",
      accessor: (signup: EventSignup) =>
        signup.availableTo.toLocaleTimeString(),
    }),
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
    table.createViewModel(columns);

  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
</script>

<div>
  <div class="rounded-md border">
    <Table {...$tableAttrs}>
      <TableHeader>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <TableRow>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                  <TableHead {...attrs}>
                    <Render of={cell.render()} />
                  </TableHead>
                </Subscribe>
              {/each}
            </TableRow>
          </Subscribe>
        {/each}
      </TableHeader>
      <TableBody {...$tableBodyAttrs}>
        {#each $pageRows as row (row.id)}
          <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
            <TableRow {...rowAttrs}>
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <TableCell {...attrs}>
                    <Render of={cell.render()} />
                  </TableCell>
                </Subscribe>
              {/each}
            </TableRow>
          </Subscribe>
        {/each}
      </TableBody>
    </Table>
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
