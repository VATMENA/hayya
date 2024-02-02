<script lang="ts">
  import type { Resource } from "@prisma/client";
  import { writable } from "svelte/store";
  import {
    createRender,
    createTable,
    Render,
    Subscribe,
  } from "svelte-headless-table";
  import ResTableActions from "./res-table-actions.svelte";
  import { page } from "$app/stores";
  import { can } from "$lib/perms/can";
  import * as Table from "$lib/components/ui/table";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Form from "$lib/components/ui/form";
  import { Plus } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { formSchema, type FormSchema } from "./schema";
  import type { SuperValidated } from "sveltekit-superforms";

  export let vaccId: string | null;
  export let resources: Resource[];

  let resources_store = writable(resources);
  $: $resources_store = resources;

  let hasEdit = vaccId
    ? can(
        $page.data.roles,
        vaccId,
        $page.data.user.vaccId,
        `vacc.${vaccId}.resource.manage`,
      )
    : can(
        $page.data.roles,
        vaccId,
        $page.data.user.vaccId,
        `division.resource.manage`,
      );

  const table = createTable(resources_store);
  const columns = table.createColumns([
    table.column({
      accessor: "name",
      header: "Name",
    }),
    table.column({
      accessor: "description",
      header: "Description",
    }),
    table.column({
      accessor: "link",
      header: "",
      cell: ({ value }) =>
        createRender(ResTableActions, {
          link: value,
          hasEditPermission: hasEdit,
        }),
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
      }
    },
  };
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Manage Resources</h2>
  {#if hasEdit}
    <Button
      on:click={() => {
        createDialogOpen = true;
      }}>
      <Plus class="mr-2 w-4 h-4" />
      Create
    </Button>
  {/if}
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
      <Dialog.Title>Add Resource</Dialog.Title>
      <Dialog.Description>
        Resources must be hosted elsewhere. Hayya will link to the resource, and
        make it easy to find in the HQ.
      </Dialog.Description>
    </Dialog.Header>

    <div class="space-y-2">
      <Form.Root
        action="?/create"
        method="POST"
        {form}
        schema={formSchema}
        {options}
        let:config>
        <Form.Field {config} name="name">
          <Form.Item>
            <Form.Label>Resource Name</Form.Label>
            <Form.Input />
            <Form.Validation />
          </Form.Item>
        </Form.Field>
        <Form.Field {config} name="description">
          <Form.Item>
            <Form.Label>Description</Form.Label>
            <Form.Textarea />
            <Form.Validation />
          </Form.Item>
        </Form.Field>
        <Form.Field {config} name="link">
          <Form.Item>
            <Form.Label>Link</Form.Label>
            <Form.Input />
            <Form.Validation />
          </Form.Item>
        </Form.Field>
        <Form.Field {config} name="private">
          <Form.Item
            class="flex flex-row items-center justify-between rounded-lg border p-4">
            <div class="space-y-0.5">
              <Form.Label>Private resource?</Form.Label>
              <Form.Description>
                If selected, will only be viewable by staff members.
              </Form.Description>
            </div>
            <Form.Switch />
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
