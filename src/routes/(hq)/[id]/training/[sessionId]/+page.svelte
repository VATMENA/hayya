<script lang="ts">
  import type { PageData } from "./$types";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  import { humanReadableDate, relativeTime } from "$lib/date.js";
  import { Badge } from "$lib/components/ui/badge";
  import {
    BookOpenIcon,
    CheckIcon,
    ClockIcon,
    GraduationCapIcon,
    MessageSquareIcon,
    UserPenIcon,
    XIcon
  } from "lucide-svelte";
  import * as Form from "$lib/components/ui/form";
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Popover from "$lib/components/ui/popover";
  import * as Select from "$lib/components/ui/select";
  import { can } from "$lib/perms/can";
  import { TRAIN } from "$lib/perms/permissions";
  import Markdown from "$lib/components/Markdown.svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import { toast } from "svelte-sonner";
  import { goto, invalidateAll } from "$app/navigation";
  import CalendarIcon from "lucide-svelte/icons/calendar";
  import { updateDetailsSchema } from "./updateDetailsSchema";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { cn } from "$lib/utils";
  import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
  import { Input } from "$lib/components/ui/input";
  import { Calendar } from "$lib/components/ui/calendar";


  export let data: PageData;

  $: description = data.isUsersSession ? `${data.session.name} - ${humanReadableDate(data.session.scheduledTime)} with ${data.session.mentor.name}` : `${data.session.name} - ${humanReadableDate(data.session.scheduledTime)} with ${data.session.student.name}`;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addItem($page.data.url, `/${data.facility.id}/training`, "Training");
    addPage($page.data.url, description);
  }

  let comment: string;
  async function addComment() {
    let data = new URLSearchParams();
    data.set("comment", comment);
    await fetch("?/addComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data.toString(),
    });
    comment = "";
    toast.success("Commented successfully!");
    await invalidateAll();
  }

  async function deleteSession() {
    await fetch("?/deleteSession", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    await goto(`/${$page.params.id}/training`);
    await invalidateAll();
    toast.success("Session removed successfully!");
  }

  let deleteOpen = false;
  let updateOpen = false;

  const form = superForm(data.updateForm, {
    validators: zodClient(updateDetailsSchema),
    dataType: 'json',
    async onUpdated({form}) {
      if (form.valid) {
        toast.success("Session updated successfully!");
        updateOpen = false;
      }
    }
  });
  const { form: formData, enhance } = form;

  $: selectedStatus = $formData.status ? { label: $formData.status, value: $formData.status } : undefined;
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">{data.session.name} with {data.isUsersSession ? data.session.mentor.name : data.session.student.name}</h2>
</div>

<div class="flex flex-col gap-1">
  <div class="flex flex-row gap-4">
    {#if data.session.status === "Scheduled"}
      <Badge>
        <ClockIcon class="w-4 h-4 mr-2" />
        Scheduled
      </Badge>
    {:else if data.session.status === "Incomplete"}
      <Badge class="bg-yellow-300">
        <XIcon class="w-4 h-4 mr-2" />
        Incomplete
      </Badge>
    {:else if data.session.status === "Complete"}
      <Badge class="bg-green-400">
        <CheckIcon class="w-4 h-4 mr-2" />
        Complete
      </Badge>
    {/if}
    <div class="text-muted-foreground text-sm">
      <b>{data.session.mentor.name}</b> is training <b>{data.session.student.name}</b> on <b>{data.session.name}</b>
    </div>
    <div class="text-muted-foreground text-sm">
      {humanReadableDate(data.session.scheduledTime)}
    </div>
  </div>

  <div class="flex flex-col md:flex-row gap-2 mt-3">
    <div class="flex-1 flex flex-col gap-2">
      <Card.Root class="flex-1">
        <Card.Header>
          <Card.Title>Comments</Card.Title>
        </Card.Header>
        <Card.Content>
          {#each data.comments as comment}
            <div class="mb-2 flex space-x-2">
              <span class="h-8 w-8 rounded-full bg-muted p-2">
                  <MessageSquareIcon class="h-4 w-4" />
              </span>
              <span class="mt-1">
                <b>{comment.user.name}</b>
                {#if comment.user.id === data.session.mentor.id}
                  <Badge variant="outline">Mentor</Badge>
                {/if}
                  <span class="text-foreground/80">
                    commented {relativeTime(comment.createdAt)}
                  </span>
              </span>
            </div>

            <div class="mb-2 ml-10">
              <div
                class="rounded border px-4 py-2 leading-7 [&:not(:first-child)]:mt-6">
                <Markdown src={comment.content} />
              </div>
            </div>
          {/each}


        </Card.Content>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Card.Title>Comment</Card.Title>
        </Card.Header>
        <Card.Content>
          <div class="h-min">
              <Textarea
                bind:value={comment}
                class="resize-none"
                placeholder="Enter your comment here. You can use Markdown to add links and styles." />
            <Button on:click={addComment} class="mt-2">Add Comment</Button>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
    <div class="flex flex-col gap-2">
      <Card.Root>
        <Card.Header>
          <Card.Title>Session Details</Card.Title>
        </Card.Header>
        <Card.Content>
          <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-2">
              <CalendarIcon class="w-6 h-6" />
              <span>{humanReadableDate(data.session.scheduledTime)}</span>
            </div>
            <div class="flex flex-row gap-2">
              <BookOpenIcon class="w-6 h-6" />
              <span>{data.session.name}</span>
            </div>
            <div class="flex flex-row gap-2">
              <GraduationCapIcon class="w-6 h-6" />
              <span>Student: {data.session.student.name}</span>
            </div>
            <div class="flex flex-row gap-2">
              <UserPenIcon class="w-6 h-6" />
              <span>Mentor: {data.session.mentor.name}</span>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
      {#if can(TRAIN)}
        <Card.Root>
          <Card.Header>
            <Card.Title>Mentor Tools</Card.Title>
          </Card.Header>
          <Card.Content>
            <Dialog.Root bind:open={updateOpen}>
              <Dialog.Trigger class={buttonVariants()}>Update Details</Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Update details</Dialog.Title>
                </Dialog.Header>
                <form method="POST" action="?/updateDetails" use:enhance>
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

                  <Form.Field {form} name="status">
                    <Form.Control let:attrs>
                      <Form.Label>Status</Form.Label>
                      <Select.Root
                        selected={selectedStatus}
                        onSelectedChange={(v) => {
          v && ($formData.status = v.value);
        }}
                      >
                        <Select.Trigger {...attrs}>
                          <Select.Value placeholder="Select a status" />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item value="Scheduled" label="Scheduled" />
                          <Select.Item value="Complete" label="Complete" />
                          <Select.Item value="Incomplete" label="Incomplete" />
                        </Select.Content>
                      </Select.Root>
                      <input hidden bind:value={$formData.status} name={attrs.name} />
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.Field>

                  <Dialog.Footer>
                    <Form.Button>Update</Form.Button>
                  </Dialog.Footer>
                </form>
              </Dialog.Content>
            </Dialog.Root>
            <Dialog.Root bind:open={deleteOpen}>
              <Dialog.Trigger class={buttonVariants()}>Delete Session</Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Are you sure?</Dialog.Title>
                  <Dialog.Description>This will immediately remove the session. It will NOT add back the request on the student's behalf. It will be as if they had never requested training in the first place.</Dialog.Description>
                </Dialog.Header>
                <Dialog.Footer>
                  <Button on:click={() => {deleteOpen = false;}} variant="outline">Nevermind</Button>
                  <Button on:click={deleteSession} variant="destructive">Yes, I'm sure</Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Root>
          </Card.Content>
        </Card.Root>
      {/if}
    </div>
  </div>
</div>