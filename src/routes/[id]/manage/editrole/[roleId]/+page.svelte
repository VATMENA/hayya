<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import type { PageData } from "./$types";
  import * as Form from "$lib/components/ui/form";
  import { formSchema } from "./schema";
  import { goto, invalidateAll } from "$app/navigation";
  import { toast } from "svelte-sonner";
  import { page } from "$app/stores";
  import { PERMISSIONS } from "$lib/perms/permissions";
  import { can } from "$lib/perms/can";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";

  export let data: PageData;

  let options = {
    onUpdated: async ({ form }) => {
      if (form.valid) {
        await invalidateAll();
        await goto(`/${$page.params.id}/manage`);
        toast.success("Role updated!");
      }
    },
  };
  let deleteOpen = false;
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">Edit Role</h2>
</div>

<Form.Root
  method="POST"
  form={data.form}
  schema={formSchema}
  {options}
  let:config>
  <Form.Item>
    <Form.Field {config} name="name">
      <Form.Label>Role Name</Form.Label>
      <Form.Input />
      <Form.Validation />
    </Form.Field>
  </Form.Item>
  <Form.Item>
    <Form.Field {config} name="color">
      <Form.Label>Role Color</Form.Label>
      <Form.Input />
      <Form.Validation />
      <Form.Description>
        A <a
          class="underline-offset-4 underline"
          href="https://tailwindcss.com/docs/customizing-colors">
          Tailwind color
        </a>
        , e.g. sky-500
      </Form.Description>
    </Form.Field>
  </Form.Item>
  {#each PERMISSIONS as permission}
    {#if can(permission)}
      <Form.Field {config} name={permission.id}>
        <Form.Item
          class="mt-2 flex flex-row items-center justify-between rounded-lg border p-4">
          <div class="space-y-0.5">
            <Form.Label>{permission.id}</Form.Label>
            <Form.Description>
              {permission.description}
            </Form.Description>
          </div>
          <Form.Switch checked={data.form.data[permission.id]} />
        </Form.Item>
      </Form.Field>
    {/if}
  {/each}
  <Form.Button>Save</Form.Button>
</Form.Root>
