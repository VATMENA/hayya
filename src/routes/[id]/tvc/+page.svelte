<script lang="ts">
  import type { PageData } from "./$types";
  // @formatter:off
  import * as Dialog from "$lib/components/ui/dialog";
  // @formatter:on
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  import CasesTable from "./CasesTable.svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import ManualAssignForm from "./ManualAssignForm.svelte";
  import { toast } from "svelte-sonner";
  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addPage($page.data.url, "Transfer & Visiting");
  }

  let manAssignOpen = false;
</script>

<div class="space-y-2">
  <div class="flex items-center justify-between space-y-2">
    <h2 class="md:text-3xl text-xl font-bold tracking-tight">
      Transfer & Visiting
    </h2>
    <Dialog.Root bind:open={manAssignOpen}>
      <Dialog.Trigger class={buttonVariants()}>Manual Assign</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Manually add visitor to roster</Dialog.Title>
          <Dialog.Description>
            If the visitor is outside of the division, they will need to log
            into Hayya once before this form will work.
          </Dialog.Description>
        </Dialog.Header>
        <ManualAssignForm
          data={data.form}
          onsubmit={() => {
            manAssignOpen = false;
            toast.success("User assignment added successfully!");
          }} />
      </Dialog.Content>
    </Dialog.Root>
  </div>

  <div>
    <CasesTable data={data.cases} />
  </div>
</div>
