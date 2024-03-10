<script lang="ts">
  import { writable } from "svelte/store";
  import { createTable, Render, Subscribe } from "svelte-headless-table";
  import * as Table from "$lib/components/ui/table";
  import type { PageData } from "./$types";
  import type { Connection, User } from "@prisma/client";

  export let data: PageData;

  const connections = writable<(Connection & { user: User })[]>(
    data.connections as any,
  );

  const table = createTable(connections);
  const columns = table.createColumns([
    table.column({
      accessor: "userId",
      header: "CID",
    }),
    table.column({
      accessor: ({ user }) => `${user.name}`,
      header: "Name",
    }),
    table.column({
      accessor: ({ user }) => `${user.ratingShort}`,
      header: "Rating",
    }),
    table.column({
      accessor: "callsign",
      header: "Callsign",
    }),
    table.column({
      accessor: "isAuthorized",
      header: "Authorized",
    }),
    table.column({
      accessor: ({ startTime }) =>
        `${startTime.toISOString().slice(11, 19)}Z (${relativeTime(startTime)})`,
      header: "Start Time",
    }),
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns);

  function relativeTime(fromDate: Date, toDate: Date = new Date()) {
    const units = [
      { max: 1000 * 60, name: "second", divisor: 1000 },
      { max: 1000 * 60 * 60, name: "minute", divisor: 1000 * 60 },
      { max: 1000 * 60 * 60 * 24, name: "hour", divisor: 1000 * 60 * 60 },
      {
        max: 1000 * 60 * 60 * 24 * 30,
        name: "day",
        divisor: 1000 * 60 * 60 * 24,
      },
    ];

    const millis = fromDate.getTime() - toDate.getTime();

    const unit = units.find((u) => Math.abs(millis) < u.max);
    if (!unit) return "Unknown";

    const difference = Math.round(millis / unit.divisor);

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    return rtf.format(difference, unit.name as any);
  }
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Active Connections</h2>
</div>

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
