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
  import {
    CheckIcon,
    CircleAlertIcon,
    CogIcon,
    EditIcon,
    LoaderCircle,
    TrashIcon,
    XIcon,
  } from "lucide-svelte";
  import PlusIcon from "lucide-svelte/icons/plus";
  import * as Alert from "$lib/components/ui/alert";
  import { buttonVariants } from "$lib/components/ui/button";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { createFormSchema } from "./createSchema";
  import * as Form from "$lib/components/ui/form";
  import { toast } from "svelte-sonner";
  import { Input } from "$lib/components/ui/input";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
  import { Switch } from "$lib/components/ui/switch";
  import { updateFormSchema } from "./editSchema";
  import { get } from "svelte/store";
  import type { TrainingPlan } from "@prisma/client";

  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addItem($page.data.url, `/${data.facility.id}/training`, "Training");
    addPage($page.data.url, "Plans");
  }

  let createDialogOpen = false;

  const createForm = superForm(data.createForm, {
    validators: zodClient(createFormSchema),
    onUpdated({ form }) {
      if (form.valid) {
        createDialogOpen = false;
        toast.success("New plan created successfully!");
      }
    },
    dataType: "json",
  });

  let updateDialogOpen = false;

  const {
    form: createFormData,
    enhance: createEnhance,
    delayed: createDelayed,
  } = createForm;

  const updateForm = superForm(data.updateForm, {
    validators: zodClient(updateFormSchema),
    onUpdated({ form }) {
      if (form.valid) {
        updateDialogOpen = false;
        toast.success("Plan updated successfully!");
      }
    },
    dataType: "json",
  });

  const {
    form: updateFormData,
    enhance: updateEnhance,
    delayed: updateDelayed,
  } = updateForm;

  function update(plan: TrainingPlan): () => void {
    return () => {
      updateForm.reset();
      let formData = get(updateFormData);

      formData.id = plan.id;
      formData.name = plan.name;
      formData.estimatedTime = plan.estimatedTimeToCompleteTraining;
      formData.includes = plan.includes;
      formData.excludes = plan.excludes;
      formData.policy = plan.relevantPolicy;
      formData.hasAdjacentRestriction = plan.hasAdjacentRestrictions;
      formData.extraDetails = plan.extraDetails;

      updateFormData.set(formData);
      updateDialogOpen = true;
    };
  }
</script>

<Dialog.Root bind:open={updateDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Update Plan - {$updateFormData.name}</Dialog.Title>
    </Dialog.Header>
    <form class="space-y-2" method="POST" action="?/update" use:updateEnhance>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <Form.Field form={updateForm} name="name">
            <Form.Control let:attrs>
              <Form.Label>Plan Name</Form.Label>
              <Input
                placeholder="Your Super Amazing Training Plan"
                {...attrs}
                bind:value={$updateFormData.name} />
            </Form.Control>
          </Form.Field>

          <Form.Field form={updateForm} name="policy">
            <Form.Control let:attrs>
              <Form.Label>Relevant Facility Policy</Form.Label>
              <Input
                placeholder="ATC Training Policy 7210.6B"
                {...attrs}
                bind:value={$updateFormData.policy} />
            </Form.Control>
            <Form.Description>
              Ensure this sounds correct: "Consult {$updateFormData.policy
                ? $updateFormData.policy
                : "your policy here"} for more details"
            </Form.Description>
          </Form.Field>

          <Form.Field form={updateForm} name="estimatedTime">
            <Form.Control let:attrs>
              <Form.Label>Estimated Time</Form.Label>
              <Input
                placeholder="2.7 days"
                {...attrs}
                bind:value={$updateFormData.estimatedTime} />
            </Form.Control>
            <Form.Description>
              Ensure this sounds correct: "Estimated Time to Completion: {$updateFormData.estimatedTime
                ? $updateFormData.estimatedTime
                : "X Months"}"
            </Form.Description>
          </Form.Field>
        </div>

        <div>
          <div class="space-y-2">
            <span
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 data-[fs-error]:text-destructive">
              Includes
            </span>
            <Button
              on:click={() => {
                $updateFormData.includes.push("");
                $updateFormData.includes = $updateFormData.includes;
              }}>
              Add
            </Button>
            {#each $updateFormData.includes as s, n}
              <div class="flex gap-2">
                <Input
                  bind:value={$updateFormData.includes[n]}
                  placeholder="Unrestricted GND..." />
                <Button
                  on:click={() => {
                    $updateFormData.includes.splice(n, 1);
                    $updateFormData.includes = $updateFormData.includes;
                  }}>
                  <TrashIcon class="h-4 w-4" />
                </Button>
              </div>
            {/each}
          </div>

          <div class="space-y-2">
            <span
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 data-[fs-error]:text-destructive">
              Excludes
            </span>
            <Button
              on:click={() => {
                $updateFormData.excludes.push("");
                $updateFormData.excludes = $updateFormData.excludes;
              }}>
              Add
            </Button>
            {#each $updateFormData.excludes as s, n}
              <div class="flex gap-2">
                <Input
                  bind:value={$updateFormData.excludes[n]}
                  placeholder="OMDB GND..." />
                <Button
                  on:click={() => {
                    $updateFormData.excludes.splice(n, 1);
                    $updateFormData.excludes = $updateFormData.excludes;
                  }}>
                  <TrashIcon class="h-4 w-4" />
                </Button>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <Form.Field form={updateForm} name="extraDetails">
        <Form.Control let:attrs>
          <Form.Label>Extra Details (Airfields)</Form.Label>
          <Input
            {...attrs}
            bind:value={$updateFormData.extraDetails}
            placeholder="Unrestricted ratings cover most airfields, including EGLL, OTHH, YZZZ..." />
        </Form.Control>
      </Form.Field>

      <Form.Field
        form={updateForm}
        name="hasAdjacentRestriction"
        class="flex flex-row items-center justify-between rounded-lg border p-4">
        <Form.Control let:attrs>
          <div class="space-y-0.5">
            <Form.Label>Has Adjacency Restriction?</Form.Label>
            <Form.Description>
              Whether this plan may have usage restrictions as laid out in GCAP
              6.1(a). Most commonly seen with a Tier 1/2 APP and an unrestricted
              CTR.
            </Form.Description>
          </div>
          <Switch
            includeInput
            {...attrs}
            bind:checked={$updateFormData.hasAdjacentRestriction} />
        </Form.Control>
      </Form.Field>

      <Form.Button class="mt-4 w-full">
        {#if $updateDelayed}
          <LoaderCircle class="h-4 w-4 animate-spin" />
        {:else}
          Update
        {/if}
      </Form.Button>
    </form>
  </Dialog.Content>
</Dialog.Root>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Training Plans</h2>
  <Dialog.Root bind:open={createDialogOpen}>
    <Dialog.Trigger class={buttonVariants()}>
      <PlusIcon class="mr-2 h-4 w-4" />
      Create
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>New Plan</Dialog.Title>
      </Dialog.Header>
      <form class="space-y-2" method="POST" action="?/create" use:createEnhance>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <Form.Field form={createForm} name="name">
              <Form.Control let:attrs>
                <Form.Label>Plan Name</Form.Label>
                <Input
                  placeholder="Your Super Amazing Training Plan"
                  {...attrs}
                  bind:value={$createFormData.name} />
              </Form.Control>
            </Form.Field>

            <Form.Field form={createForm} name="policy">
              <Form.Control let:attrs>
                <Form.Label>Relevant Facility Policy</Form.Label>
                <Input
                  placeholder="ATC Training Policy 7210.6B"
                  {...attrs}
                  bind:value={$createFormData.policy} />
              </Form.Control>
              <Form.Description>
                Ensure this sounds correct: "Consult {$createFormData.policy
                  ? $createFormData.policy
                  : "your policy here"} for more details"
              </Form.Description>
            </Form.Field>

            <Form.Field form={createForm} name="estimatedTime">
              <Form.Control let:attrs>
                <Form.Label>Estimated Time</Form.Label>
                <Input
                  placeholder="2.7 days"
                  {...attrs}
                  bind:value={$createFormData.estimatedTime} />
              </Form.Control>
              <Form.Description>
                Ensure this sounds correct: "Estimated Time to Completion: {$createFormData.estimatedTime
                  ? $createFormData.estimatedTime
                  : "X Months"}"
              </Form.Description>
            </Form.Field>
          </div>

          <div>
            <div class="space-y-2">
              <span
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 data-[fs-error]:text-destructive">
                Includes
              </span>
              <Button
                on:click={() => {
                  $createFormData.includes.push("");
                  $createFormData.includes = $createFormData.includes;
                }}>
                Add
              </Button>
              {#each $createFormData.includes as s, n}
                <div class="flex gap-2">
                  <Input
                    bind:value={$createFormData.includes[n]}
                    placeholder="Unrestricted GND..." />
                  <Button
                    on:click={() => {
                      $createFormData.includes.splice(n, 1);
                      $createFormData.includes = $createFormData.includes;
                    }}>
                    <TrashIcon class="h-4 w-4" />
                  </Button>
                </div>
              {/each}
            </div>

            <div class="space-y-2">
              <span
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 data-[fs-error]:text-destructive">
                Excludes
              </span>
              <Button
                on:click={() => {
                  $createFormData.excludes.push("");
                  $createFormData.excludes = $createFormData.excludes;
                }}>
                Add
              </Button>
              {#each $createFormData.excludes as s, n}
                <div class="flex gap-2">
                  <Input
                    bind:value={$createFormData.excludes[n]}
                    placeholder="OMDB GND..." />
                  <Button
                    on:click={() => {
                      $createFormData.excludes.splice(n, 1);
                      $createFormData.excludes = $createFormData.excludes;
                    }}>
                    <TrashIcon class="h-4 w-4" />
                  </Button>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <Form.Field form={createForm} name="extraDetails">
          <Form.Control let:attrs>
            <Form.Label>Extra Details (Airfields)</Form.Label>
            <Input
              {...attrs}
              bind:value={$createFormData.extraDetails}
              placeholder="Unrestricted ratings cover most airfields, including EGLL, OTHH, YZZZ..." />
          </Form.Control>
        </Form.Field>

        <Form.Field
          form={createForm}
          name="hasAdjacentRestriction"
          class="flex flex-row items-center justify-between rounded-lg border p-4">
          <Form.Control let:attrs>
            <div class="space-y-0.5">
              <Form.Label>Has Adjacency Restriction?</Form.Label>
              <Form.Description>
                Whether this plan may have usage restrictions as laid out in
                GCAP 6.1(a). Most commonly seen with a Tier 1/2 APP and an
                unrestricted CTR.
              </Form.Description>
            </div>
            <Switch
              includeInput
              {...attrs}
              bind:checked={$createFormData.hasAdjacentRestriction} />
          </Form.Control>
        </Form.Field>

        <Form.Button class="mt-4 w-full">
          {#if $createDelayed}
            <LoaderCircle class="h-4 w-4 animate-spin" />
          {:else}
            Create
          {/if}
        </Form.Button>
      </form>
    </Dialog.Content>
  </Dialog.Root>
</div>

<div class="flex flex-col gap-4 pt-2 md:flex-row md:flex-wrap">
  {#each data.plans as plan}
    <Card.Root class="flex-1 md:min-w-96 md:max-w-96">
      <Card.Header>
        <Card.Title>{plan.name}</Card.Title>
        <Card.Description>
          See {plan.relevantPolicy} for more details.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        {#each plan.includes as i}
          <div class="flex flex-row gap-2">
            <CheckIcon class="text-green-500" />
            {i}
          </div>
        {/each}
        {#each plan.excludes as e}
          <div class="flex flex-row gap-2">
            <XIcon class="text-red-500" />
            {e}
          </div>
        {/each}

        <p class="mt-6">
          Estimated Time to Completion: {plan.estimatedTimeToCompleteTraining}
          <span class="text-muted-foreground">
            ({plan.TrainingPlanRegistration.length} students in queue)
          </span>
        </p>

        <p class="mt-6 text-xs text-muted-foreground">
          Time estimates may be inaccurate and do not constitute a guarantee of
          training.
        </p>

        <p class="text-xs text-muted-foreground">{plan.extraDetails}</p>

        {#if plan.hasAdjacentRestrictions}
          <Alert.Root class="mt-6 bg-muted">
            <CircleAlertIcon class="h-4 w-4" />
            <Alert.Title>Rating Limitations</Alert.Title>
            <Alert.Description>
              This training plan may have limitations on when you can use your
              certification, in compliance with GCAP 6.1(a). Consult ATC
              training policy 7210.5B for more details on what these limitations
              entail.
            </Alert.Description>
          </Alert.Root>
        {/if}

        <Button on:click={update(plan)}>
          <EditIcon class="mr-2 h-4 w-4" />
          Edit
        </Button>
      </Card.Content>
    </Card.Root>
  {/each}
</div>
