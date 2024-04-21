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
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms/client";
  import Input from "$lib/components/ui/input/input.svelte";
  import { FieldErrors } from "formsnap";
  import { Switch } from "$lib/components/ui/switch";
  import { LoaderCircle } from "lucide-svelte";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";

  export let data: PageData;

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    async onUpdated({ form }) {
      if (form.valid) {
        await invalidateAll();
        await goto(`/${$page.params.id}/manage`);
        toast.success("Role created!");
      }
    },
  });

  const { form: formData, enhance, delayed } = form;
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">Edit Role {$formData.name}</h2>
</div>

<form method="POST" use:enhance class="space-y-4">
  <Form.Field {form} name="name">
    <Form.Control let:attrs>
      <Form.Label>Role Name</Form.Label>
      <Input {...attrs} bind:value={$formData.name} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="color">
    <Form.Control let:attrs>
      <Form.Label>Role Color</Form.Label>
      <Input {...attrs} bind:value={$formData.color} />
    </Form.Control>
    <Form.Description>
      A <a
        class="underline-offset-4 underline"
        href="https://tailwindcss.com/docs/customizing-colors">
        Tailwind color descriptor
      </a>
      , e.g. sky-500
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  {#each PERMISSIONS as permission}
    {#if can(permission)}
      <Form.Field
        {form}
        name={permission.id}
        class="flex flex-row items-center justify-between rounded-lg border p-4">
        <Form.Control let:attrs>
          <div class="space-y-0.5">
            <Form.Label>{permission.id}</Form.Label>
            <Form.Description>
              {permission.description}
            </Form.Description>
          </div>
          <Switch
            includeInput
            {...attrs}
            bind:checked={$formData[permission.id]} />
        </Form.Control>
      </Form.Field>
    {/if}
  {/each}

  <Form.Button class="w-full">
    {#if $delayed}
      <LoaderCircle class="animate-spin w-5 h-5" />
    {:else}
      Save
    {/if}
  </Form.Button>
</form>
