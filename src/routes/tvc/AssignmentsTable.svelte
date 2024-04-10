<script lang="ts">
  import type { UserFacilityAssignment } from "@prisma/client";
  import { writable } from "svelte/store";
  // @formatter:off
  import * as Table from "$lib/components/ui/table";
  // @formatter:on
  import { createRender, createTable, Render, Subscribe } from "svelte-headless-table";
  import AssignmentsTableAction from "./AssignmentsTableAction.svelte";
  import AssignmentsTableCaseId from "./AssignmentsTableCaseId.svelte";

  export let data: UserFacilityAssignment[];

  let store = writable(data);
  $: $store = data;

  const table = createTable(store);

  const columns = table.createColumns([
    table.column({
      accessor: "facilityId",
      header: "Facility"
    }),
    table.column({
      accessor: "assignmentType",
      header: "Assignment Type",
      cell: ({value}) => {
        if (value === "Primary") {
          return "Home Facility";
        } else if (value === "Secondary") {
          return "Visitor";
        } else if (value === "DivisionalStaff") {
          return "Division Staff";
        } else {
          return "Other";
        }
      }
    }),
    table.column({
      accessor: (u) => u,
      header: "Case #",
      cell: ({value}) => createRender(AssignmentsTableCaseId, { id: value.caseId, facilityId: value.facilityId })
    }),
    table.column({
      accessor: (u) => u,
      header: "",
      cell: ({value}) => createRender(AssignmentsTableAction, { data: value })
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