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
  import Plus from "lucide-svelte/icons/plus";
  import { Button } from "$lib/components/ui/button";
  import {
    formSchema,
    type FormSchema,
    formSchema2,
    type FormSchema2,
  } from "./schema";
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import type { PageData } from "./$types";
  import { toast } from "svelte-sonner";
  import ActionButtons from "./actions.svelte";
  import DataTableUser from "./data-table-user.svelte";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Input } from "$lib/components/ui/input";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";

  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/admin", `Site Administration`);
    addPage($page.data.url, "Manage Divisional Staff Assignments");
  }

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
  let createDialogOpen2 = false;

  let dform: SuperValidated<Infer<FormSchema>> = data.form!;
  let dform2: SuperValidated<Infer<FormSchema2>> = data.form2!;

  const form = superForm(dform, {
    validators: zodClient(formSchema),
    onUpdated({ form }) {
      if (form.valid) {
        createDialogOpen = false;
        toast.success("User assignments updated!");
      }
    },
  });

  const { form: formData, enhance, delayed } = form;

  const form2 = superForm(dform2, {
    validators: zodClient(formSchema2),
    onUpdated({ form }) {
      if (form.valid) {
        createDialogOpen2 = false;
        toast.success("User assignments updated!");
      }
    },
  });

  const { form: formData2, enhance: enhance2, delayed: delayed2 } = form2;
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
    New
  </Button>
  <Button
    on:click={() => {
      createDialogOpen2 = true;
    }}>
    <Plus class="mr-2 w-4 h-4" />
    New All
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
      <form action="?/create" method="POST" use:enhance>
        <Form.Field {form} name="cid">
          <Form.Control let:attrs>
            <Form.Label>User CID</Form.Label>
            <Input {...attrs} bind:value={$formData.cid} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="facilityId">
          <Form.Control let:attrs>
            <Form.Label>Facility ID</Form.Label>
            <Input {...attrs} bind:value={$formData.facilityId} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Button class="mt-2 w-100">
          <Plus class="mr-2 w-4 h-4" />
          Create
        </Form.Button>
      </form>
    </div>
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={createDialogOpen2}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>New Divisional Staff Assignment</Dialog.Title>
    </Dialog.Header>

    <div class="space-y-2">
      <form action="?/createAll" method="POST" use:enhance2>
        <Form.Field form={form2} name="cid">
          <Form.Control let:attrs>
            <Form.Label>User CID</Form.Label>
            <Input {...attrs} bind:value={$formData2.cid} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Button class="mt-2 w-100">
          <Plus class="mr-2 w-4 h-4" />
          Create
        </Form.Button>
      </form>
    </div>
  </Dialog.Content>
</Dialog.Root>
