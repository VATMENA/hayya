<script lang="ts">
  import {
    createRender,
    createTable,
    Render,
    Subscribe,
  } from "svelte-headless-table";
  import { readable } from "svelte/store";
  import type { TrainingQueue } from "@prisma/client";
  import CircleCheck from "lucide-svelte/icons/circle-check";
  import CircleX from "lucide-svelte/icons/circle-x";
  import DataTableActions from "./data-table-actions.svelte";
  import * as Table from "$lib/components/ui/table";
  import { addPagination } from "svelte-headless-table/plugins";
  import { Button } from "$lib/components/ui/button";

  export let queues: TrainingQueue[];
  export let canJoin: string[];
  export let memberOf: TrainingQueue | undefined;

  const table = createTable(readable(queues), {
    page: addPagination(),
  });

  const columns = table.createColumns([
    table.column({
      accessor: "name",
      header: "Name",
    }),
    table.column({
      accessor: "description",
      header: "Description",
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "Able to join?",
      cell: ({ value }) => {
        if (canJoin.includes(value)) {
          return createRender(CircleCheck, { class: "text-green-500" });
        } else {
          return createRender(CircleX, { class: "text-red-500" });
        }
      },
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "",
      cell: ({ value }) => {
        return createRender(DataTableActions, {
          id: value,
          canJoin: canJoin.includes(value),
          canLeave: memberOf ? memberOf!.id === value : false,
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
