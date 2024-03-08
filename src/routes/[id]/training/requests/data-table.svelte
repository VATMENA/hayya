<script lang="ts">
  import type { TrainingRequest } from "@prisma/client";
  import { writable } from "svelte/store";
  import { createRender, createTable } from "svelte-headless-table";
  import DataTableAssigned from "./data-table-assigned.svelte";

  export let data: TrainingRequest[];

  $: $store = data;
  let store = writable(data);

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
      accessor: "instructor",
      header: "Assigned?",
      cell: ({value}) => createRender(DataTableAssigned, { instructor: value })
    })
  ])
</script>