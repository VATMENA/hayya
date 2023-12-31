<script lang="ts">
    import {onMount} from "svelte";
    import type {PageData} from "./$types";
    import {can} from "$lib/perms";
    import {goto} from "$app/navigation";
    import {page} from "$app/stores";
    import * as Form from "$lib/components/ui/form";
    import { formSchema, type FormSchema } from "./schema";
    import type { SuperValidated } from "sveltekit-superforms";

    export let data: PageData;

    export let form: SuperValidated<FormSchema>;

    onMount(() => {
        if (!can(data.roles, ["|vacc.details.edit"])) {
            goto("/dashboard");
            return;
        }
    })
</script>

<div class="flex items-center justify-between space-y-2">
    <h2 class="text-3xl font-bold tracking-tight">Editing vACC - {$page.params.id}</h2>
</div>

<Form.Root method="POST" {form} schema={formSchema} let:config>
    <Form.Field {config} name="name">
        <Form.Item>
            <Form.Label>vACC Name</Form.Label>
            <Form.Input />
            <Form.Description>The name of the vACC.</Form.Description>
            <Form.Validation />
        </Form.Item>
    </Form.Field>
    <Form.Field {config} name="website">
        <Form.Item>
            <Form.Label>vACC Website</Form.Label>
            <Form.Input />
            <Form.Description>The public website of the vACC.</Form.Description>
            <Form.Validation />
        </Form.Item>
    </Form.Field>
    <Form.Field {config} name="contact_email">
        <Form.Item>
            <Form.Label>Contact Email</Form.Label>
            <Form.Input />
            <Form.Description>An email that can be used for direct inquiries to vACC staff.</Form.Description>
            <Form.Validation />
        </Form.Item>
    </Form.Field>

    <Form.Button>Save</Form.Button>
</Form.Root>
