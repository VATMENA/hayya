<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { CheckIcon, XIcon } from "lucide-svelte";
  import { invalidateAll } from "$app/navigation";
  import { toast } from "svelte-sonner";
  import * as Dialog from "$lib/components/ui/dialog";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { type UpgradeSchema, upgradeSchema } from "./upgradeSchema";
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import { cn } from "$lib/utils";
  import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
  import { Calendar } from "$lib/components/ui/calendar";
  import { Input } from "$lib/components/ui/input";
  import * as Form from "$lib/components/ui/form";
  import * as Popover from "$lib/components/ui/popover";
  import CalendarIcon from "lucide-svelte/icons/calendar";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";

  export let id: string;
  export let data: SuperValidated<Infer<UpgradeSchema>>;

  let deleteOpen: boolean = false;
  let upgradeOpen: boolean = false;

  async function cancel() {
    let data = new URLSearchParams();
    data.set("id", id);
    await fetch("?/cancelRequest", {
      method: 'POST',
      body: data.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    });
    deleteOpen = false;
    await invalidateAll();
    toast.success("Request cancelled successfully!");
  }

  const form = superForm(data, {
    validators: zodClient(upgradeSchema),
    dataType: 'json'
  });
  const { form: formData, enhance } = form;

  $: $formData.requestId = id;
</script>

<Dialog.Root bind:open={upgradeOpen}>
  <Dialog.Trigger class={buttonVariants()}>
    <CheckIcon class="w-4 h-4 mr-2" />
    Accept Request
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Upgrade into session</Dialog.Title>
      <Dialog.Description>
        By clicking continue, this request will be upgraded into a Session. You are committing to scheduling a session with your student, and attending the session according to your vACC's training policy.
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" use:enhance action="?/upgradeRequest">
      <div class="flex flex-row gap-4">
        <div class="flex-1">
          <Form.Field {form} name="sessionDate.date" class="flex flex-col">
            <Form.Control let:attrs>
              <Form.Label>Date</Form.Label>
              <Popover.Root>
                <Popover.Trigger
                  {...attrs}
                  class={cn(
            buttonVariants({ variant: "outline" }),
            "max-w-full overflow-clip text-left",
            !($formData.sessionDate.date) && "text-muted-foreground"
          )}
                >
                  {$formData.sessionDate.date}
                  <CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
                </Popover.Trigger>
                <Popover.Content class="w-auto p-0" side="top">
                  <Calendar
                    value={parseDate($formData.sessionDate.date)}
                    minValue={today(getLocalTimeZone())}
                    calendarLabel="Date of birth"
                    initialFocus
                    onValueChange={(v) => {
              if (v) {
                $formData.sessionDate.date = v.toString();
              } else {
                $formData.sessionDate.date = "";
              }
            }}
                  />
                </Popover.Content>
              </Popover.Root>
              <Form.FieldErrors />
              <input hidden value={$formData.sessionDate.date} name={attrs.name} />
            </Form.Control>
          </Form.Field>
        </div>

        <div class="flex-2">
          <div class="flex flex-row">
            <Form.Field {form} name="sessionDate.time.hour" class="flex flex-col">
              <Form.Control let:attrs>
                <Form.Label>Time (HH)</Form.Label>
                <Input {...attrs} type="number" min={0} max={23} bind:value={$formData.sessionDate.time.hour} />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
            <p class="mt-6 font-semibold text-lg">:</p>
            <Form.Field {form} name="sessionDate.time.minute" class="flex flex-col">
              <Form.Control let:attrs>
                <Form.Label>(MM)</Form.Label>
                <Input {...attrs} type="number" bind:value={$formData.sessionDate.time.minute} />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
        </div>
      </div>

      <Form.Field {form} name="scoresheetUrl" class="flex flex-col">
        <Form.Control let:attrs>
          <Form.Label>Scoresheet URL (Optional)</Form.Label>
          <Input {...attrs} type="url" bind:value={$formData.scoresheetUrl} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <input type="hidden" value={id} name="requestId" />

      <Dialog.Footer>
        <Button on:click={() => {upgradeOpen = false;}} variant="outline">Nevermind</Button>
        <Form.Button variant="destructive">Continue</Form.Button>
      </Dialog.Footer>
    </form>


  </Dialog.Content>
</Dialog.Root>
<Dialog.Root bind:open={deleteOpen}>
  <Dialog.Trigger class={buttonVariants()}>
    <XIcon class="w-4 h-4 mr-2" />
    Cancel Request
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you sure?</Dialog.Title>
      <Dialog.Description>
        This will immediately remove your training request. New requests will be moved to the back of the queue.
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button on:click={() => {deleteOpen = false;}} variant="outline">Nevermind</Button>
      <Button on:click={cancel} variant="destructive">Yes, cancel it</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>