<script lang="ts">
  import type { TrainingRequest } from "@prisma/client";
  import { writable } from "svelte/store";
  import { createRender, createTable, Render, Subscribe } from "svelte-headless-table";
  import DataTableAssigned from "./data-table-assigned.svelte";
  import DataTableActions from "./data-table-actions.svelte";
  import DataTableAvailability from "./data-table-availability.svelte";
  import * as Table from "$lib/components/ui/table";

  export let data: TrainingRequest[];
  let store = writable(data);
  $: $store = data;

  const table = createTable(store);

  const columns = table.createColumns([
    table.column({
      accessor: ({ student }) => student.name,
      header: "Student"
    }),
    table.column({
      accessor: "trainingType",
      header: "Training Type"
    }),
    table.column({
      accessor: ({ instructor }) => instructor,
      header: "Assigned?",
      cell: ({value}) => createRender(DataTableAssigned, { instructor: value })
    }),
    table.column({
      accessor: (u) => u,
      header: "Availability",
      cell: ({value}) => createRender(DataTableAvailability, { request: value })
    }),
    table.column({
      accessor: (o) => o,
      header: "Actions",
      cell: ({value}) => createRender(DataTableActions, { request: value })
    })
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

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