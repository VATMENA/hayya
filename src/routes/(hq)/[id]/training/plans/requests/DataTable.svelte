<script lang="ts">
  import type {
    TrainingPlanRegistrationRequest,
    User,
    TrainingPlan,
  } from "@prisma/client";
  import { writable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
  import {
    createTable,
    Subscribe,
    Render,
    createRender,
  } from "svelte-headless-table";
  import DataTableActions from "./DataTableActions.svelte";

  export let data: (TrainingPlanRegistrationRequest & {
    user: User;
    plan: TrainingPlan;
  })[];

  let store = writable(data);
  $: $store = data;

  const table = createTable(store);
  const columns = table.createColumns([
    table.column({
      accessor: ({ user }) => user.id,
      header: "Student CID",
    }),
    table.column({
      accessor: ({ user }) => user.name,
      header: "Student Name",
    }),
    table.column({
      accessor: ({ user }) => user.ratingShort,
      header: "Student Rating",
    }),
    table.column({
      accessor: ({ plan }) => plan.name,
      header: "Plan",
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "Actions",
      cell: ({ value }) => createRender(DataTableActions, { id: value }),
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
