<script lang="ts">
  import {
    createRender,
    createTable,
    Render,
    Subscribe,
  } from "svelte-headless-table";
  import { readable } from "svelte/store";
  import DataTableActions from "./data-table-actions.svelte";
  import * as Table from "$lib/components/ui/table";
  import { addPagination } from "svelte-headless-table/plugins";
  import { Button } from "$lib/components/ui/button";
  import type { TrainingQueueMembership } from "@prisma/client";
  import { relativeTime } from "$lib/date";

  export let members: TrainingQueueMembership[];

  const table = createTable(readable(members), {
    page: addPagination(),
  });

  const columns = table.createColumns([
    table.column({
      accessor: (member: any) => member.user.name,
      header: "Name",
    }),
    table.column({
      accessor: (member: any) => member.user.id,
      header: "CID",
    }),
    table.column({
      accessor: (member: TrainingQueueMembership) =>
        relativeTime(member.joinedAt),
      header: "Joined queue",
    }),
    table.column({
      accessor: (member: TrainingQueueMembership) =>
        member.joinedAt.toDateString(),
      header: "Join date",
    }),
    table.column({
      accessor: (member: any) => member.user.id,
      header: "",
      cell: ({ value }) => {
        return createRender(DataTableActions, {
          id: value,
        });
      },
    }),
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
    table.createViewModel(columns);

  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
</script>

<div>
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
