<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import type { PageData } from "./$types";
  import { Badge } from "$lib/components/ui/badge";
  import { color } from "$lib/colors";
  import Button from "$lib/components/ui/button/button.svelte";
  import Plus from "lucide-svelte/icons/plus";
  import * as Dialog from "$lib/components/ui/dialog";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  import { can } from "$lib/perms/can";
  import { MANAGE_TRAINING_PLANS } from "$lib/perms/permissions";
  import { CheckIcon, CircleAlertIcon, CogIcon, LoaderCircle, XIcon } from "lucide-svelte";
  import PlusIcon from "lucide-svelte/icons/plus";
  import * as Alert from "$lib/components/ui/alert";
  import { buttonVariants } from "$lib/components/ui/button";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { createFormSchema } from "./createSchema";
  import * as Form from "$lib/components/ui/form";
  import { toast } from "svelte-sonner";
  import { Input } from "$lib/components/ui/input";

  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addItem($page.data.url, `/${data.facility.id}/training`, "Training");
    addPage($page.data.url, "Plans");
  }

  let createDialogOpen = false;

  const form = superForm(data.createForm, {
    validators: zodClient(createFormSchema),
    onUpdated({form}) {
      if (form.valid) {
        createDialogOpen = false;
        toast.success("New plan created successfully!");
      }
    }
  });

  const { form: formData, enhance, delayed } = form;
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Training Plans</h2>
  <Dialog.Root bind:open={createDialogOpen}>
    <Dialog.Trigger class={buttonVariants()}>
      <PlusIcon class="w-4 h-4 mr-2" />
      Create
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>New Plan</Dialog.Title>
      </Dialog.Header>
      <form class="space-y-2" method="POST" action="?/create" use:enhance>
        <Form.Field {form} name="name">
          <Form.Control let:attrs>
            <Form.Label>Plan Name</Form.Label>
            <Input {...attrs} bind:value={$formData.name} />
          </Form.Control>
        </Form.Field>

        <Form.Field {form} name="policy">
          <Form.Control let:attrs>
            <Form.Label>Relevant Facility Policy</Form.Label>
            <Input {...attrs} bind:value={$formData.policy} />
          </Form.Control>
          <Form.Description>Ensure this sounds correct: "Consult {$formData.policy ? $formData.policy : 'your policy here'} for more details"</Form.Description>
        </Form.Field>

        <Form.Field {form} name="estimatedTime">
          <Form.Control let:attrs>
            <Form.Label>Estimated Time</Form.Label>
            <Input {...attrs} bind:value={$formData.estimatedTime} />
          </Form.Control>
          <Form.Description>Ensure this sounds correct: "Estimated Time to Completion: {$formData.estimatedTime ? $formData.estimatedTime : 'X Months'}"</Form.Description>
        </Form.Field>

        <Form.Button>
          {#if $delayed}
            <LoaderCircle class="w-4 h-4 animate-spin" />
          {:else}
            Create
          {/if}
        </Form.Button>
      </form>
    </Dialog.Content>
  </Dialog.Root>
</div>

<div class="gap-4 pt-2 flex flex-col md:flex-row md:flex-wrap">

    <Card.Root class="flex-1 md:min-w-96 md:max-w-96">
      <Card.Header>
        <Card.Title>Unrestricted Training</Card.Title>
        <Card.Description>See ATC training policy 7210.5B for more details.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="flex flex-row gap-2">
          <CheckIcon class="text-green-500" />
          S1 Rating
        </div>
        <div class="flex flex-row gap-2">
          <CheckIcon class="text-green-500" />
          Unrestricted DEL & GND
        </div>
        <div class="flex flex-row gap-2">
          <XIcon class="text-red-500" />
          OMDB DEL & GND Certificates
        </div>

        <p class="mt-6">Estimated Time to Completion: 4 months <span class="text-muted-foreground">(27 students in queue)</span></p>

        <p class="text-xs text-muted-foreground">Time estimates may be inaccurate and do not constitute a guarantee of training.</p>

        <p class="mt-6 text-xs text-muted-foreground">Unrestricted ratings cover most airfields, including OTHH, OBBI, OOMS, and OMSJ</p>

        <Alert.Root class="mt-6 bg-muted">
          <CircleAlertIcon class="h-4 w-4" />
          <Alert.Title>Rating Limitations</Alert.Title>
          <Alert.Description>
            This training plan may have limitations on when you can use your certification, in compliance with GCAP 6.1(a).
            Consult ATC training policy 7210.5B for more details on what these limitations entail.
          </Alert.Description>
        </Alert.Root>
      </Card.Content>
    </Card.Root>
  <Card.Root class="flex-1 md:min-w-96 md:max-w-96">
    <Card.Header>
      <Card.Title>OMDB Training</Card.Title>
      <Card.Description>See ATC training policy 7210.5B for more details.</Card.Description>
    </Card.Header>
    <Card.Content>
      <div class="flex flex-row gap-2">
        <CheckIcon class="text-green-500" />
        S1 Rating
      </div>
      <div class="flex flex-row gap-2">
        <CheckIcon class="text-green-500" />
        Unrestricted DEL & GND
      </div>
      <div class="flex flex-row gap-2">
        <CheckIcon class="text-green-500" />
        OMDB DEL & GND Certificates
      </div>

      <p class="mt-6">Estimated Time to Completion: 6 months</p>
      <p class="text-xs text-muted-foreground">Time estimates may be inaccurate and do not constitute a guarantee of training.</p>

      <p class="mt-6 text-xs text-muted-foreground">Unrestricted ratings cover most airfields, including OTHH, OBBI, OOMS, and OMSJ</p>
    </Card.Content>
  </Card.Root>
  <Card.Root class="flex-1 md:min-w-96 md:max-w-96">
    <Card.Header>
      <Card.Title>Unrestricted Training</Card.Title>
      <Card.Description>See ATC training policy 7210.5B for more details.</Card.Description>
    </Card.Header>
    <Card.Content>
      <div class="flex flex-row gap-2">
        <CheckIcon class="text-green-500" />
        S1 Rating
      </div>
      <div class="flex flex-row gap-2">
        <CheckIcon class="text-green-500" />
        Unrestricted DEL & GND
      </div>
      <div class="flex flex-row gap-2">
        <XIcon class="text-red-500" />
        OMDB DEL & GND Certificates
      </div>

      <p class="mt-6">Estimated Time to Completion: 4 months <span class="text-muted-foreground">(27 students in queue)</span></p>

      <p class="text-xs text-muted-foreground">Time estimates may be inaccurate and do not constitute a guarantee of training.</p>

      <p class="mt-6 text-xs text-muted-foreground">Unrestricted ratings cover most airfields, including OTHH, OBBI, OOMS, and OMSJ</p>

      <Alert.Root class="mt-6 bg-muted">
        <CircleAlertIcon class="h-4 w-4" />
        <Alert.Title>Rating Limitations</Alert.Title>
        <Alert.Description>
          This training plan may have limitations on when you can use your certification, in compliance with GCAP 6.1(a).
          Consult ATC training policy 7210.5B for more details on what these limitations entail.
        </Alert.Description>
      </Alert.Root>
    </Card.Content>
  </Card.Root>
  <Card.Root class="flex-1 md:min-w-96 md:max-w-96">
    <Card.Header>
      <Card.Title>Unrestricted Training</Card.Title>
      <Card.Description>See ATC training policy 7210.5B for more details.</Card.Description>
    </Card.Header>
    <Card.Content>
      <div class="flex flex-row gap-2">
        <CheckIcon class="text-green-500" />
        S1 Rating
      </div>
      <div class="flex flex-row gap-2">
        <CheckIcon class="text-green-500" />
        Unrestricted DEL & GND
      </div>
      <div class="flex flex-row gap-2">
        <XIcon class="text-red-500" />
        OMDB DEL & GND Certificates
      </div>

      <p class="mt-6">Estimated Time to Completion: 4 months <span class="text-muted-foreground">(27 students in queue)</span></p>

      <p class="text-xs text-muted-foreground">Time estimates may be inaccurate and do not constitute a guarantee of training.</p>

      <p class="mt-6 text-xs text-muted-foreground">Unrestricted ratings cover most airfields, including OTHH, OBBI, OOMS, and OMSJ</p>

      <Alert.Root class="mt-6 bg-muted">
        <CircleAlertIcon class="h-4 w-4" />
        <Alert.Title>Rating Limitations</Alert.Title>
        <Alert.Description>
          This training plan may have limitations on when you can use your certification, in compliance with GCAP 6.1(a).
          Consult ATC training policy 7210.5B for more details on what these limitations entail.
        </Alert.Description>
      </Alert.Root>
    </Card.Content>
  </Card.Root>
  <Card.Root class="flex-1 md:min-w-96 md:max-w-96">
    <Card.Header>
      <Card.Title>Unrestricted Training</Card.Title>
      <Card.Description>See ATC training policy 7210.5B for more details.</Card.Description>
    </Card.Header>
    <Card.Content>
      <div class="flex flex-row gap-2">
        <CheckIcon class="text-green-500" />
        S1 Rating
      </div>
      <div class="flex flex-row gap-2">
        <CheckIcon class="text-green-500" />
        Unrestricted DEL & GND
      </div>
      <div class="flex flex-row gap-2">
        <XIcon class="text-red-500" />
        OMDB DEL & GND Certificates
      </div>

      <p class="mt-6">Estimated Time to Completion: 4 months <span class="text-muted-foreground">(27 students in queue)</span></p>

      <p class="text-xs text-muted-foreground">Time estimates may be inaccurate and do not constitute a guarantee of training.</p>

      <p class="mt-6 text-xs text-muted-foreground">Unrestricted ratings cover most airfields, including OTHH, OBBI, OOMS, and OMSJ</p>

      <Alert.Root class="mt-6 bg-muted">
        <CircleAlertIcon class="h-4 w-4" />
        <Alert.Title>Rating Limitations</Alert.Title>
        <Alert.Description>
          This training plan may have limitations on when you can use your certification, in compliance with GCAP 6.1(a).
          Consult ATC training policy 7210.5B for more details on what these limitations entail.
        </Alert.Description>
      </Alert.Root>
    </Card.Content>
  </Card.Root>
</div>
