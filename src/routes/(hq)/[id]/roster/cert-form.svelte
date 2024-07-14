<script lang="ts">
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import { formSchema, type FormSchema } from "./schema";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { C_TYP, P_TYP, POS } from "$lib/cert";
  import * as Form from "$lib/components/ui/form";
  import * as Select from "$lib/components/ui/select";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Switch } from "$lib/components/ui/switch";
  import DatePicker from "$lib/components/DatePicker.svelte";
  import { getLocalTimeZone, today } from "@internationalized/date";
  import { LoaderCircle } from "lucide-svelte";
  import { _as } from "$lib/typescriptMagic";

  export let data: SuperValidated<Infer<FormSchema>>;
  export let onsubmit: () => void;
  export let userId: string;

  const form = superForm(data, {
    validators: zodClient(formSchema),
    onUpdated({ form }) {
      if (form.valid) {
        onsubmit();
      }
    },
  });

  const { form: formData, enhance, delayed } = form;

  let p_typ_labels: Map<P_TYP, string> = new Map();
  p_typ_labels.set(
    P_TYP.Unrestricted,
    "An unrestricted position approval across all airfields in the subdivision",
  );
  p_typ_labels.set(
    P_TYP.Specific,
    "An unrestricted position at a specific airfield",
  );
  p_typ_labels.set(P_TYP.Tier1, "A position in a specific Tier 1 facility");
  p_typ_labels.set(P_TYP.Tier2, "A Tier 2 position endorsement");
  p_typ_labels.set(P_TYP.SuperCenter, "A Super Center position");
  p_typ_labels.set(P_TYP.OpenSkies, "An OpenSkies position");

  let requiresFacilityId: P_TYP[] = [
    P_TYP.Specific,
    P_TYP.Tier1,
    P_TYP.SuperCenter,
  ];
  let requiresPosition: P_TYP[] = [
    P_TYP.Unrestricted,
    P_TYP.Specific,
    P_TYP.Tier1,
    P_TYP.Tier2,
    P_TYP.OpenSkies,
  ];

  let selectedPtyp: { label: string; value: string } | undefined = undefined;
  $: selectedPtyp = $formData.p_typ
    ? {
        label: p_typ_labels.get($formData.p_typ)!,
        value: $formData.p_typ,
      }
    : undefined;

  $: $formData.id = userId;
  $: {
    if (!requiresFacilityId.includes($formData.p_typ)) {
      $formData.facility = undefined;
    }
  }

  let positions = Object.values(POS);

  let selectedPosition: { label: string; value: string } | undefined =
    undefined;
  $: selectedPosition = $formData.pos
    ? { label: $formData.pos, value: $formData.pos }
    : undefined;

  $: {
    if (!requiresPosition.includes($formData.p_typ)) {
      $formData.pos = undefined;
    }
  }

  let isSolo = false;
  $: {
    if (isSolo) {
      $formData.c_typ = C_TYP.Solo;
    } else {
      $formData.c_typ = C_TYP.Permanent;
      $formData.solo_expires = undefined;
    }
  }
</script>

<form action="?/issue_certificate" method="POST" use:enhance class="space-y-4">
  <input hidden bind:value={userId} name="id" />
  <input hidden bind:value={$formData.c_typ} name="c_typ" />
  <Form.Field {form} name="p_typ">
    <Form.Control let:attrs>
      <Form.Label>
        What type of position are you issuing a certificate for?
      </Form.Label>
      <Select.Root
        selected={selectedPtyp}
        onSelectedChange={(v) => {
          v && ($formData.p_typ = _as(v.value));
        }}>
        <Select.Trigger {...attrs}>
          <Select.Value placeholder="Select..." />
        </Select.Trigger>
        <Select.Content>
          {#each [...p_typ_labels] as [value, label]}
            <Select.Item {value} {label} />
          {/each}
        </Select.Content>
      </Select.Root>
      <input type="hidden" bind:value={$formData.p_typ} name="p_typ" />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  {#if requiresFacilityId.includes($formData.p_typ)}
    <Form.Field {form} name="facility">
      <Form.Control let:attrs>
        <Form.Label>Facility ID</Form.Label>
        <Input {...attrs} bind:value={$formData.facility} />
      </Form.Control>
      <Form.Description>
        3 or 4 character identifier of the facility
      </Form.Description>
      <Form.FieldErrors />
    </Form.Field>
  {/if}
  {#if requiresPosition.includes($formData.p_typ)}
    <Form.Field {form} name="pos">
      <Form.Control let:attrs>
        <Form.Label>Position</Form.Label>
        <Select.Root
          selected={selectedPosition}
          onSelectedChange={(v) => {
            v && ($formData.pos = _as(v.value));
          }}>
          <Select.Trigger {...attrs}>
            <Select.Value placeholder="Select..." />
          </Select.Trigger>
          <Select.Content>
            {#each positions as v}
              <Select.Item value={v} label={v} />
            {/each}
          </Select.Content>
        </Select.Root>
        <input hidden bind:value={$formData.pos} name={attrs.name} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  {/if}
  <div class="flex flex-row items-center justify-between rounded-lg">
    <div class="space-y-0.5">
      <p class="text-sm font-medium leading-none">Solo certificate?</p>
    </div>
    <Switch bind:checked={isSolo} />
  </div>
  {#if isSolo}
    <Form.Field {form} name="solo_expires" class="flex flex-col">
      <Form.Control let:attrs>
        <Form.Label>Solo Expiry</Form.Label>
        <DatePicker
          name="solo_expires"
          form={formData}
          {attrs}
          calendarLabel="Set a solo expiry date"
          minValue={today(getLocalTimeZone()).add({ days: 7 })}
          maxValue={today(getLocalTimeZone()).add({ days: 90 })}
          placeholderDate={today(getLocalTimeZone()).add({ days: 7 })} />
      </Form.Control>
      <Form.Description>
        Per GCAP 7.3(c), solo endorsements must have a duration of at least 7
        and at most 90 days.
      </Form.Description>
      <Form.FieldErrors />
    </Form.Field>
  {/if}
  <Form.Field {form} name="comments">
    <Form.Control let:attrs>
      <Form.Label>Comments</Form.Label>
      <Textarea
        class="resize-none"
        {...attrs}
        bind:value={$formData.comments} />
    </Form.Control>
    <Form.Description>
      Any additional information or restrictions
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button class="w-full">
    {#if $delayed}
      <LoaderCircle class="h-5 w-5 animate-spin" />
    {:else}
      Issue Certificate
    {/if}
  </Form.Button>
</form>
