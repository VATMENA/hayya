<script lang="ts">
  import type { PageData } from "./$types";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  import { writable } from "svelte/store";
  import { createRender, createTable, Render, Subscribe } from "svelte-headless-table";
  import * as Table from "$lib/components/ui/table";
  import { relativeTime } from "$lib/date";
  import ORActions from "./ORActions.svelte";
  import ORAvailability from "./ORAvailability.svelte";

  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addItem($page.data.url, `/${data.facility.id}/training`, "Training");
    addPage($page.data.url, "Outstanding Requests");
  }

  function sortArrayByWaitingPeriod(a: (typeof data.requests[0]), b: (typeof data.requests[0])) {
    return b.registration.createdAt.getTime() - a.registration.createdAt.getTime();
  }

  const store = writable(data.requests.toSorted(sortArrayByWaitingPeriod));
  $: $store = data.requests.toSorted(sortArrayByWaitingPeriod);

  const table = createTable(store);
  const columns = table.createColumns([
    table.column({
      accessor: (value) => value.registration.plan.name,
      header: "Training Plan",
    }),
    table.column({
      accessor: (value) => {
        return {
          cid: value.registration.user.id,
          name: value.registration.user.name,
          rating: value.registration.user.ratingShort
        }
      },
      header: "Student",
      cell: ({value}) => {
        return `${value.name} - ${value.rating} (${value.cid})`
      }
    }),
    table.column({
      accessor: (value) => value.registration.createdAt,
      header: "Waiting Since",
      cell: ({value}) => {
        return relativeTime(value, new Date(), "day");
      }
    }),
    table.column({
      accessor: "availability",
      header: "Availability",
      cell: ({value}) => createRender(ORAvailability, { avail: value })
    }),
    table.column({
      accessor: "notes",
      header: "Notes",
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "Actions",
      cell: ({value}) => createRender(ORActions, { id: value, data: data.upgradeForm })
    })
  ]);
  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns);
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Outstanding Requests</h2>
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