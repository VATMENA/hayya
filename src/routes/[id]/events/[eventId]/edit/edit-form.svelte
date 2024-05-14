<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import * as Alert from "$lib/components/ui/alert";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import { formSchema, type FormSchema } from "./edit-form";
  import { onMount } from "svelte";
  import { X, AlertCircle, Plus } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { fade, slide } from "svelte/transition";
  import { goto } from "$app/navigation";
    import { zodClient } from 'sveltekit-superforms/adapters';

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
  });

  const removePosition = (index: number) => {
    positions = positions.filter((_, i) => i !== index);
  };
</script>

<form
  method="POST"
  use:enhance
  action="?/editEvent">
  <input type="hidden" name="positions" bind:value={positions} />

  <div class="max-w-xs">
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
      <Input type="text" placeholder="Add position" bind:value={addPosition} />
      <Button
        on:click={() => {
          positions = [...positions, addPosition.toUpperCase()];
          addPosition = "";
        }}>
        <Plus class="w-3 h-3" />
      </Button>
    </div>
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
