<script lang="ts">
  import type { User } from "@prisma/client";
  import { writable } from "svelte/store";
  import {
    createRender,
    createTable,
    Render,
    Subscribe,
  } from "svelte-headless-table";
  import * as Table from "$lib/components/ui/table";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Form from "$lib/components/ui/form";
  import { Plus } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { formSchema, type FormSchema } from "./schema";
  import type { SuperValidated } from "sveltekit-superforms";
  import type { PageData } from "./$types";
  import { toast } from "svelte-sonner";
  import ActionButtons from "./actions.svelte";
  import DataTableUser from "./data-table-user.svelte";

  export let data: PageData;

  let users_store = writable(data.users!);
  $: $users_store = data.users!;

  const table = createTable(users_store);
  const columns = table.createColumns([
    table.column({
      accessor: (o) => o,
      header: "Name & Facility Roles",
      cell: ({ value }) =>
        createRender(DataTableUser, { userAssignment: value }),
    }),
    table.column({
      accessor: "facilityId",
      header: "Facility ID",
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "",
      cell: ({ value }) => createRender(ActionButtons, { id: value }),
    }),
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns);

  let createDialogOpen = false;

  export let form: SuperValidated<FormSchema>;

  let options = {
    onUpdated: ({ form }) => {
      if (form.valid) {
        createDialogOpen = false;
        toast.success("User assignments updated!");
      }
    },
  };
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">
    Manage Divisional Staff Assignments
  </h2>
  <Button
    on:click={() => {
      createDialogOpen = true;
    }}>
    <Plus class="mr-2 w-4 h-4" />
    Create
  </Button>
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

<Dialog.Root bind:open={createDialogOpen}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>New Staff Assignment</Dialog.Title>
    </Dialog.Header>

    <div class="space-y-2">
      <Form.Root
        action="?/create"
        method="POST"
        {form}
        schema={formSchema}
        {options}
        let:config>
        <Form.Field {config} name="cid">
          <Form.Item>
            <Form.Label>User CID</Form.Label>
            <Form.Input />
            <Form.Validation />
          </Form.Item>
        </Form.Field>
        <Form.Field {config} name="facilityId">
          <Form.Item>
            <Form.Label>Facility ID</Form.Label>
            <Form.Input />
            <Form.Validation />
          </Form.Item>
        </Form.Field>
        <Form.Button class="mt-2 w-100">
          <Plus class="mr-2 w-4 h-4" />
          Create
        </Form.Button>
      </Form.Root>
    </div>
  </Dialog.Content>
</Dialog.Root>
