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
  import * as Select from "$lib/components/ui/select";
  import Plus from "lucide-svelte/icons/plus";
  import { Button } from "$lib/components/ui/button";
  import { formSchema, type FormSchema } from "./schema";
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import type { PageData } from "./$types";
  import { toast } from "svelte-sonner";
  import ActionButtons from "./actions.svelte";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Input } from "$lib/components/ui/input";
  import { LoaderCircle } from "lucide-svelte";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";

  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/admin", `Site Administration`);
    addPage($page.data.url, "Manage Facilities");
  }

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

  let formSV: SuperValidated<Infer<FormSchema>> = data.form!;

  const form = superForm(formSV, {
    validators: zodClient(formSchema),
    onUpdated({ form }) {
      if (form.valid) {
        createDialogOpen = false;
        toast.success("Facility created!");
      }
    },
  });

  const { form: formData, enhance, delayed } = form;

  $: selectedDotnetType = $formData.dotnetType
    ? {
        label: $formData.dotnetType,
        value: $formData.dotnetType,
      }
    : undefined;
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Manage Facilities</h2>
  <Button
    on:click={() => {
      createDialogOpen = true;
    }}>
    <Plus class="mr-2 h-4 w-4" />
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
      <form action="?/create" method="POST" use:enhance>
        <Form.Field {form} name="id">
          <Form.Control let:attrs>
            <Form.Label>Facility ID</Form.Label>
            <Input {...attrs} bind:value={$formData.id} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="name">
          <Form.Control let:attrs>
            <Form.Label>Facility Name</Form.Label>
            <Input {...attrs} bind:value={$formData.name} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="dotnetId">
          <Form.Control let:attrs>
            <Form.Label>VATSIM Facility ID</Form.Label>
            <Input {...attrs} bind:value={$formData.dotnetId} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="dotnetType">
          <Form.Control let:attrs>
            <Form.Label>VATSIM Facility Type</Form.Label>
            <Select.Root
              selected={selectedDotnetType}
              onSelectedChange={(v) => {
                v && ($formData.dotnetType = v.value);
              }}>
              <Select.Trigger {...attrs}>
                <Select.Value placeholder="Select..." />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="Division" label="Division" />
                <Select.Item value="Subdivision" label="Subdivision" />
              </Select.Content>
            </Select.Root>
            <input hidden bind:value={$formData.dotnetType} name={attrs.name} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Button class="w-full">
          {#if $delayed}
            <LoaderCircle class="h-5 w-5 animate-spin" />
          {:else}
            Create
          {/if}
        </Form.Button>
      </form>
    </div>
  </Dialog.Content>
</Dialog.Root>
