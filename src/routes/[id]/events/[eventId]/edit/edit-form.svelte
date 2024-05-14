<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import * as Alert from "$lib/components/ui/alert";
  import {
    superForm,
    type Infer,
    type SuperValidated,
  } from "sveltekit-superforms";
  import { formSchema, type FormSchema } from "./edit-form";
  import { onMount } from "svelte";
  import { X, AlertCircle, Plus, CircleHelp } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { fade, slide } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Switch } from "$lib/components/ui/switch";
  import * as Popover from "$lib/components/ui/popover";

  export let data: SuperValidated<Infer<FormSchema>>;
  export let onSubmit: any;
  export let event: any;

  const form = superForm(data, {
    validators: zodClient(formSchema),
    onUpdated: ({ form }) => {
      if (form.valid) {
        onSubmit();
      }
    },
  });

  const { form: formData, enhance, delayed } = form;

  let positions: string[] = [];
  let addPosition: string = "";

  onMount(() => {
    positions = event.positions;
    $formData.name = event.name;
    $formData.description = event.description;
    $formData.public = event.public;
    $formData.allowSignups = event.allowSignups;
  });

  const removePosition = (index: number) => {
    positions = positions.filter((_, i) => i !== index);
  };
</script>

<form method="POST" use:enhance action="?/editEvent">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="max-w-lg">
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label>Name</Form.Label>
          <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="description">
        <Form.Control let:attrs>
          <Form.Label>Description</Form.Label>
          <Textarea {...attrs} bind:value={$formData.description} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="public">
        <Form.Control let:attrs>
          <Form.Label>
            Public event
            <Popover.Root>
              <Popover.Trigger>
                <CircleHelp class="size-4" />
              </Popover.Trigger>
              <Popover.Content>
                A public event will be visible on the events page to all
                members. Uncheck to keep this event visible only to staff.
              </Popover.Content>
            </Popover.Root>
          </Form.Label>
          <Switch {...attrs} bind:checked={$formData.public} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="allowSignups">
        <Form.Control let:attrs>
          <Form.Label>
            Allow signups
            <Popover.Root>
              <Popover.Trigger>
                <CircleHelp class="size-4" />
              </Popover.Trigger>
              <Popover.Content>
                Allow members to sign up to control at this event. You will need
                to specify the event positions you intend to roster.
              </Popover.Content>
            </Popover.Root>
          </Form.Label>
          <Switch {...attrs} bind:checked={$formData.allowSignups} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>

    {#if $formData.allowSignups}
      <div class="max-w-xs">
        <input type="hidden" name="positions" bind:value={positions} />

        <span class="text-lg font-bold">Event positions</span>
        <div class="divide-y-2">
          {#each positions as position, index (position)}
            <div
              transition:slide
              class="py-2 px-3 hover:bg-slate-100 flex justify-between items-center group">
              {position}
              <Button variant="ghost" on:click={() => removePosition(index)}>
                <X
                  class="group-hover:inline-block md:hidden text-slate-400 hover:text-slate-600" />
              </Button>
            </div>
          {/each}
        </div>

        <div class="flex justify-between space-x-2 items-baseline mt-3">
          <Input
            type="text"
            placeholder="Add position"
            bind:value={addPosition} />
          <Button
            on:click={() => {
              positions = [...positions, addPosition.toUpperCase()];
              addPosition = "";
            }}>
            <Plus class="w-3 h-3" />
          </Button>
        </div>
      </div>
    {/if}
  </div>

  <Form.Button class="mt-5">Save</Form.Button>
  <Button
    variant="outline"
    on:click={() => goto(`/${event.hostId}/events/${event.id}`)}>
    Cancel
  </Button>

  {#if positions != event.positions}
    <div transition:fade class="mt-4 max-w-sm">
      <Alert.Root variant="destructive">
        <AlertCircle class="h-4 w-4" />
        <Alert.Title>Unsaved changes!</Alert.Title>
        <Alert.Description>
          You have unsaved changes to the event positions. Make sure to use the
          button above to save your changes.
        </Alert.Description>
      </Alert.Root>
    </div>
  {/if}
</form>
