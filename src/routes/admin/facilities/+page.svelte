<script lang="ts">
  import type { Facility } from "@prisma/client";
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

  export let data: PageData;

  let facilities_store = writable(data.facilities!);
  $: $facilities_store = data.facilities!;

  const table = createTable(facilities_store);
  const columns = table.createColumns([
    table.column({
      accessor: "id",
      header: "ID",
    }),
    table.column({
      accessor: "name",
      header: "Name",
    }),
    table.column({
      accessor: "dotnetId",
      header: ".NET ID",
    }),
    table.column({
      accessor: "dotnetType",
      header: ".NET Type",
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
        toast.success("Facility created!");
      }
    },
  };
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Manage Facilities</h2>
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
      <Dialog.Title>New Facility</Dialog.Title>
    </Dialog.Header>

    <div class="space-y-2">
      <Form.Root
        action="?/create"
        method="POST"
        {form}
        schema={formSchema}
        {options}
        let:config>
        <Form.Field {config} name="id">
          <Form.Item>
            <Form.Label>Facility ID</Form.Label>
            <Form.Input />
            <Form.Validation />
          </Form.Item>
        </Form.Field>
        <Form.Field {config} name="name">
          <Form.Item>
            <Form.Label>Facility Name</Form.Label>
            <Form.Input />
            <Form.Validation />
          </Form.Item>
        </Form.Field>
        <Form.Field {config} name="dotnetId">
          <Form.Item>
            <Form.Label>.NET ID</Form.Label>
            <Form.Input />
            <Form.Validation />
          </Form.Item>
        </Form.Field>
        <Form.Item>
          <Form.Field {config} name="dotnetType">
            <Form.Label>.NET Type</Form.Label>
            <Form.Select>
              <Form.SelectTrigger placeholder=".NET Type" />
              <Form.SelectContent>
                <Form.SelectItem value="Division">Division</Form.SelectItem>
                <Form.SelectItem value="Subdivision">
                  Subdivision
                </Form.SelectItem>
              </Form.SelectContent>
            </Form.Select>
            <Form.Validation />
          </Form.Field>
        </Form.Item>
        <Form.Button class="mt-2 w-100">
          <Plus class="mr-2 w-4 h-4" />
          Create
        </Form.Button>
      </Form.Root>
    </div>
  </Dialog.Content>
</Dialog.Root>
