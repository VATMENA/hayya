<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import * as Table from "$lib/components/ui/table";
  import * as Alert from "$lib/components/ui/alert";
  import type { PageData } from "./$types";
  import { Badge } from "$lib/components/ui/badge";
  import { color } from "$lib/colors";
  import Button from "$lib/components/ui/button/button.svelte";
  import Plus from "lucide-svelte/icons/plus";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  import { can } from "$lib/perms/can";
  import {
    MANAGE_PLAN_ENROLLMENT_REQUESTS,
    MANAGE_TRAINING_PLANS,
    TRAIN,
  } from "$lib/perms/permissions";
  import {
    CheckCircleIcon,
    CheckIcon,
    CircleAlertIcon,
    ClockIcon,
    CogIcon,
    DoorOpenIcon,
    EditIcon,
    EyeIcon,
    GitPullRequestArrowIcon,
    MailsIcon,
    ScrollTextIcon,
    XCircleIcon,
    XIcon,
  } from "lucide-svelte";
  import { buttonVariants } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import type { TrainingPlan, TrainingPlanRegistration } from "@prisma/client";
  import { invalidateAll } from "$app/navigation";
  import { toast } from "svelte-sonner";
  import PlusIcon from "lucide-svelte/icons/plus";
  import RequestForm from "./RequestForm.svelte";
  import RequestTable from "./RequestTable.svelte";
  import { humanReadableDate } from "$lib/date.js";
  import { Label } from "$lib/components/ui/label";
  import { Input } from "$lib/components/ui/input";
  import Markdown from "$lib/components/Markdown.svelte";

  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addPage($page.data.url, "Training");
  }

  let enrollOpen = false;

  let selectedPlan:
    | (TrainingPlan & { TrainingPlanRegistration: TrainingPlanRegistration[] })
    | null = null;
  let confirmEnrollOpen = false;

  async function enroll() {
    if (!selectedPlan) return;
    let data = new URLSearchParams();
    data.set("id", selectedPlan.id);
    await fetch("?/enroll", {
      method: "POST",
      body: data.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: document.cookie,
      },
    });
    selectedPlan = null;
    enrollOpen = false;
    await invalidateAll();
    toast.success(
      "Enrollment request submitted. It'll be reviewed by a staff member soon.",
    );
  }

  let confirmCancelOpen = false;

  async function cancelEnroll() {
    await fetch("?/cancelEnroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: document.cookie,
      },
    });
    confirmCancelOpen = false;
    await invalidateAll();
    toast.success("Enrollment request cancelled.");
  }

  async function unenroll() {
    await fetch("?/cancelEnrollment", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: document.cookie,
      },
    });

    await invalidateAll();
    toast.success("You've been unenrolled. Pick a new plan to start training.");
  }

  let confirmUnenrollOpen = false;
  let requestOpen = false;
  let showRequestsOpen = false;

  let transcriptCid: string;
</script>

<div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">Training</h2>
</div>

<div class="flex max-w-lg flex-col gap-y-4 pt-2">
  <Card.Root class="sm:w-full md:w-[50vw]">
    <Card.Header>
      <Card.Title>Your Training</Card.Title>
    </Card.Header>
    <Card.Content>
      {#if data.activePlan}
        <p>
          You're currently enrolled in the {data.activePlan.plan.name} plan.
        </p>
        <Dialog.Root bind:open={confirmUnenrollOpen}>
          <Dialog.Trigger class="{buttonVariants()} mt-2">
            <DoorOpenIcon class="mr-2 h-4 w-4" />
            Leave Plan
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Leave Plan</Dialog.Title>
            <p>
              You will be immediately removed from the plan. Outstanding
              training requests will be removed. Joining again will still place
              you at the back of the queue! Are you sure?
            </p>
            <Dialog.Footer>
              <Button
                on:click={() => {
                  confirmUnenrollOpen = false;
                }}>
                Nevermind
              </Button>
              <Button on:click={unenroll} variant="destructive">
                Yes, leave the plan
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
        <p class="mt-2">
          You have {data.activePlan.requests.length} outstanding request{data
            .activePlan.requests.length === 1
            ? ""
            : "s"} for training.
        </p>
        <Dialog.Root bind:open={requestOpen}>
          <Dialog.Trigger class="{buttonVariants()} mt-2">
            <PlusIcon class="mr-2 h-4 w-4" />
            Request Training
          </Dialog.Trigger>
          <Dialog.Content class="min-w-screen md:min-w-[30vw]">
            <Dialog.Title>Request Training</Dialog.Title>
            <RequestForm
              data={data.requestForm}
              onsubmit={() => {
                toast.success("Request submitted successfully!");
                requestOpen = false;
              }} />
          </Dialog.Content>
        </Dialog.Root>
        <Dialog.Root bind:open={showRequestsOpen}>
          <Dialog.Trigger class="{buttonVariants()} mt-2">
            <EyeIcon class="mr-2 h-4 w-4" />
            View My Requests
          </Dialog.Trigger>
          <Dialog.Content class="min-w-screen md:min-w-[75vw]">
            <Dialog.Title>Your Requests</Dialog.Title>
            <div class="block">
              <RequestTable data={data.activePlan.requests} />
            </div>
          </Dialog.Content>
        </Dialog.Root>
      {:else if data.activePlanRequest}
        <p>
          You currently have an outstanding request to join the {data
            .activePlanRequest.plan.name} plan.
        </p>
        <Dialog.Root bind:open={confirmCancelOpen}>
          <Dialog.Trigger class="{buttonVariants()} mt-2">
            <XCircleIcon class="mr-2 h-4 w-4" />
            Cancel Request
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Cancel Enrollment Request</Dialog.Title>
            <p>
              This will immediately cancel your request. You'll need to submit a
              new one to start or continue training. Are you sure?
            </p>
            <Dialog.Footer>
              <Button
                on:click={() => {
                  confirmCancelOpen = false;
                }}>
                Nevermind
              </Button>
              <Button on:click={cancelEnroll} variant="destructive">
                Yes, cancel request
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      {:else}
        <p>You're not currently enrolled in a training plan.</p>
        <Button
          class="mt-2"
          on:click={() => {
            enrollOpen = true;
          }}>
          <DoorOpenIcon class="mr-2 h-4 w-4" />
          Enroll
        </Button>
      {/if}
    </Card.Content>
  </Card.Root>

  <Card.Root class="sm:w-full md:w-[50vw]">
    <Card.Header>
      <Card.Title>Your Sessions</Card.Title>
    </Card.Header>
    <Card.Content>
      {#if data.sessions.length === 0}
        <p>You haven't had any sessions yet.</p>
      {:else}
        <ScrollArea class="h-[33vh]">
          <ScrollArea>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Type</Table.Head>
                  <Table.Head>Date</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Mentor</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {#each data.sessions as session}
                  <Table.Row>
                    <Table.Cell>{session.plan.name}</Table.Cell>
                    <Table.Cell>
                      {humanReadableDate(session.scheduledTime)}
                    </Table.Cell>
                    <Table.Cell>
                      {#if session.status === "Scheduled"}
                        <Badge>
                          <ClockIcon class="mr-2 h-4 w-4" />
                          Scheduled
                        </Badge>
                      {:else if session.status === "Incomplete"}
                        <Badge class="bg-yellow-300">
                          <XIcon class="mr-2 h-4 w-4" />
                          Incomplete
                        </Badge>
                      {:else if session.status === "Complete"}
                        <Badge class="bg-green-400">
                          <CheckIcon class="mr-2 h-4 w-4" />
                          Complete
                        </Badge>
                      {/if}
                    </Table.Cell>
                    <Table.Cell>{session.mentor.name}</Table.Cell>
                    <Table.Cell>
                      <Button href="/{$page.params.id}/training/{session.id}">
                        <EyeIcon class="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                {/each}
              </Table.Body>
            </Table.Root>
          </ScrollArea>
        </ScrollArea>
      {/if}
    </Card.Content>
  </Card.Root>

  {#if can(MANAGE_TRAINING_PLANS) || can(MANAGE_PLAN_ENROLLMENT_REQUESTS)}
    <Card.Root class="sm:w-full md:w-[50vw]">
      <Card.Header>
        <Card.Title>Training Plans</Card.Title>
      </Card.Header>
      <Card.Content>
        {#if can(MANAGE_TRAINING_PLANS)}
          <Button href="/{$page.params.id}/training/plans">
            <CogIcon class="mr-2 h-4 w-4" />
            Manage Training Plans
          </Button>
        {/if}

        {#if can(MANAGE_PLAN_ENROLLMENT_REQUESTS)}
          <Button href="/{$page.params.id}/training/plans/requests">
            <MailsIcon class="mr-2 h-4 w-4" />
            Manage Plan Join Requests
          </Button>
        {/if}
      </Card.Content>
    </Card.Root>
  {/if}

  {#if can(TRAIN)}
    <Card.Root class="sm:w-full md:w-[50vw]">
      <Card.Header>
        <Card.Title>Mentoring</Card.Title>
      </Card.Header>
      <Card.Content>
        <Button href="/{$page.params.id}/training/requests">
          <GitPullRequestArrowIcon class="mr-2 h-4 w-4" />
          Outstanding Requests
        </Button>

        <Dialog.Root>
          <Dialog.Trigger class={buttonVariants()}>
            <ScrollTextIcon class="mr-2 h-4 w-4" />
            View User's Transcript
          </Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>View User's Transcript</Dialog.Title>
              <Dialog.Description>
                Enter a user's CID then click the button to view their *whole*
                transcript, including those sessions conducted in other vACCs.
              </Dialog.Description>

              <div class="flex w-full flex-col gap-1.5">
                <Label for="email">VATSIM ID</Label>
                <Input
                  bind:value={transcriptCid}
                  type="number"
                  id="cid"
                  placeholder="1710004" />
              </div>

              <Button
                href="/{$page.params.id}/training/transcript/{transcriptCid}/">
                View
              </Button>
            </Dialog.Header>
          </Dialog.Content>
        </Dialog.Root>
        {#if data.mentorSessions.length === 0}
          <p>You haven't had any sessions yet.</p>
        {:else}
          <ScrollArea class="h-[33vh]">
            <ScrollArea>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Type</Table.Head>
                    <Table.Head>Date</Table.Head>
                    <Table.Head>Status</Table.Head>
                    <Table.Head>Student</Table.Head>
                    <Table.Head>Actions</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {#each data.mentorSessions as session}
                    <Table.Row>
                      <Table.Cell>{session.plan.name}</Table.Cell>
                      <Table.Cell>
                        {humanReadableDate(session.scheduledTime)}
                      </Table.Cell>
                      <Table.Cell>
                        {#if session.status === "Scheduled"}
                          <Badge>
                            <ClockIcon class="mr-2 h-4 w-4" />
                            Scheduled
                          </Badge>
                        {:else if session.status === "Incomplete"}
                          <Badge class="bg-yellow-300">
                            <XIcon class="mr-2 h-4 w-4" />
                            Incomplete
                          </Badge>
                        {:else if session.status === "Complete"}
                          <Badge class="bg-green-400">
                            <CheckIcon class="mr-2 h-4 w-4" />
                            Complete
                          </Badge>
                        {/if}
                      </Table.Cell>
                      <Table.Cell>{session.student.name}</Table.Cell>
                      <Table.Cell>
                        <Button href="/{$page.params.id}/training/{session.id}">
                          <EyeIcon class="mr-2 h-4 w-4" />
                          View/Modify
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  {/each}
                </Table.Body>
              </Table.Root>
            </ScrollArea>
          </ScrollArea>
        {/if}
      </Card.Content>
    </Card.Root>
  {/if}
</div>

<Dialog.Root bind:open={enrollOpen}>
  <Dialog.Content class="max-w-full md:max-w-[50vw]">
    <Dialog.Header>
      <Dialog.Title>Enroll in Plan</Dialog.Title>
      <Dialog.Description>
        Below are the training plans that have been made available by your vACC.
      </Dialog.Description>
    </Dialog.Header>
    <ScrollArea orientation="horizontal" class="">
      <div class="flex w-max space-x-4 p-4">
        {#each data.plans as plan}
          <Card.Root class="flex-1 md:min-w-96 md:max-w-96">
            <Card.Header>
              <Card.Title>{plan.name}</Card.Title>
              <Card.Description>
                <Markdown src="See {plan.relevantPolicy} for more details." />
              </Card.Description>
            </Card.Header>
            <Card.Content>
              {#each plan.includes as i}
                <div class="flex flex-row gap-2">
                  <CheckIcon class="text-green-500" />
                  <Markdown src={i} />
                </div>
              {/each}
              {#each plan.excludes as e}
                <div class="flex flex-row gap-2">
                  <XIcon class="text-red-500" />
                  <Markdown src={e} />
                </div>
              {/each}

              <p class="mt-6">
                Estimated Time to Completion: {plan.estimatedTimeToCompleteTraining}
                <span class="text-muted-foreground">
                  ({plan.TrainingPlanRegistration.length} students in queue)
                </span>
              </p>

              <p class="mt-6 text-xs text-muted-foreground">
                Time estimates may be inaccurate and do not constitute a
                guarantee of training.
              </p>

              <p class="text-xs text-muted-foreground"><Markdown src={plan.extraDetails} /></p>

              <Button
                on:click={() => {
                  selectedPlan = plan;
                  enrollOpen = false;
                  confirmEnrollOpen = true;
                }}
                class="mt-6">
                <CheckCircleIcon class="mr-2 h-4 w-4" />
                Select This Plan
              </Button>

              {#if plan.hasAdjacentRestrictions}
                <Alert.Root class="mt-6 bg-muted">
                  <CircleAlertIcon class="size-6" />
                  <Alert.Title class="text-lg">Rating Limitations</Alert.Title>
                  <Alert.Description>
                    This training plan may have limitations on when you can use
                    your certification, in compliance with GCAP 6.1(a). Consult
                    ATC training policy 7210.5B for more details on what these
                    limitations entail.
                  </Alert.Description>
                </Alert.Root>
              {/if}
            </Card.Content>
          </Card.Root>
        {/each}
      </div>
    </ScrollArea>
  </Dialog.Content>
</Dialog.Root>

{#if selectedPlan}
  <Dialog.Root bind:open={confirmEnrollOpen}>
    <Dialog.Content class="max-w-full md:max-w-[50vw]">
      <Dialog.Header>
        <Dialog.Title>Confirm enrollment in {selectedPlan.name}</Dialog.Title>
        <Dialog.Description>
          Below are the training plans that have been made available by your
          vACC.
        </Dialog.Description>
      </Dialog.Header>
      <p>
        All enrollments must be approved by a staff member before you can
        request training.
      </p>
      <p>
        Ensure you have read and understood {selectedPlan.relevantPolicy} in it's
        entirety.
      </p>
      <p>Are you sure you want to enroll in {selectedPlan.name}?</p>
      <Dialog.Footer>
        <Button on:click={enroll}>
          <CheckIcon class="mr-2 h-4 w-4" />
          Yes, Enroll
        </Button>
        <Button
          on:click={() => {
            confirmEnrollOpen = false;
          }}>
          <XIcon class="mr-2 h-4 w-4" />
          Nevermind
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/if}
