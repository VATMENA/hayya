<script lang="ts">
  import type { TrainingRequest } from "@prisma/client";
  import { writable } from "svelte/store";
  import {
    createRender,
    createTable,
    Render,
    Subscribe,
  } from "svelte-headless-table";
  import * as Table from "$lib/components/ui/table";
  import RequestTableActions from "./RequestTableActions.svelte";

  export let data: TrainingRequest[];
  let store = writable(data);
  $: $store = data;

  const table = createTable(store);
  const columns = table.createColumns([
    table.column({
      accessor: "availability",
      header: "Availability",
      cell: ({ value }) => {
        let str = "";

        let jd = JSON.parse(value);

        for (let day of jd) {
          str += `${day.date}: ${day.start.hour.toString().padStart(2, "0")}:${day.start.minute.toString().padStart(2, "0")} -> ${day.end.hour.toString().padStart(2, "0")}:${day.end.minute.toString().padStart(2, "0")};`;
        }

        return str;
      },
    }),
    table.column({
      accessor: "notes",
      header: "Notes",
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "Actions",
      cell: ({ value }) => createRender(RequestTableActions, { id: value }),
    }),
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
