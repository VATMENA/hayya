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
  import { formSchema, type FormSchema } from "./schema";
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import type { PageData } from "./$types";
  import { toast } from "svelte-sonner";
  import ActionButtons from "./actions.svelte";
  import { superForm } from "sveltekit-superforms/client";
  import { Input } from "$lib/components/ui/input";
  import { LoaderCircle } from "lucide-svelte";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";

  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/admin", `Site Administration`);
    addPage($page.data.url, "Manage Site Administrators");
  }

  let users_store = writable(data.users!);
  $: $users_store = data.users!;

  const table = createTable(users_store);
  const columns = table.createColumns([
    table.column({
      accessor: "name",
      header: "Name",
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

  let formSV: SuperValidated<Infer<FormSchema>> = data.form!;

  const form = superForm(formSV, {
    validators: zodClient(formSchema),
    onUpdated({ form }) {
      if (form.valid) {
        createDialogOpen = false;
        toast.success("User has been set as a site admin");
      }
    },
  });

  const { form: formData, enhance, delayed } = form;
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Manage Site Admins</h2>
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
      <Dialog.Title>New Site Admin</Dialog.Title>
    </Dialog.Header>

    <div class="space-y-2">
      <form method="POST" action="?/create" use:enhance>
        <Form.Field {form} name="cid">
          <Form.Control let:attrs>
            <Form.Label>User CID</Form.Label>
            <Input {...attrs} bind:value={$formData.cid} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Button>
          {#if $delayed}
            <LoaderCircle class="animate-spin w-5 h-5" />
          {:else}
            Add Admin
          {/if}
        </Form.Button>
      </form>
    </div>
  </Dialog.Content>
</Dialog.Root>
