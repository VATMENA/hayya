<script lang="ts">
  import type { TVCase } from "@prisma/client";
  import { writable } from "svelte/store";
  // @formatter:off
  import * as Table from "$lib/components/ui/table";
  // @formatter:on
  import {
    createRender,
    createTable,
    Render,
    Subscribe,
  } from "svelte-headless-table";
  import CasesTableId from "./CasesTableId.svelte";

  export let data: TVCase[];

  let store = writable(data);
  $: $store = data;

  const table = createTable(store);

  const columns = table.createColumns([
    table.column({
      accessor: (u) => u,
      header: "Case ID",
      cell: ({value}) => createRender(CasesTableId, { id: value.id.toString(), facilityId: value.facilityId })
    }),
    table.column({
      accessor: "caseType",
      header: "Case Type"
    }),
    table.column({
      accessor: "facilityId",
      header: "Facility"
    }),
    table.column({
      accessor: "caseState",
      header: "Status",
    })
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns);
</script>

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
