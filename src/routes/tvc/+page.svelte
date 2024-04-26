<script lang="ts">
  // @formatter:off
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog";
  // @formatter:on
  import SquareUserIcon from "lucide-svelte/icons/square-user";
  import TowerControlIcon from "lucide-svelte/icons/tower-control";
  import UserIcon from "lucide-svelte/icons/user";
  import NetworkIcon from "lucide-svelte/icons/network";
  import type { PageData } from "./$types";
  import { EarthIcon, LandPlotIcon } from "lucide-svelte";
  import AssignmentsTable from "./AssignmentsTable.svelte";
  import { Button } from "$lib/components/ui/button";
  import CircleCheck from "lucide-svelte/icons/circle-check";
  import CircleX from "lucide-svelte/icons/circle-x";
  import { goto } from "$app/navigation";
  import CasesTable from "./CasesTable.svelte";

  export let data: PageData;

  let submitNewDialogOpen = false;
  let visitFacilityDialogOpen = false;
  let transferDialogOpen = false;
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">
    Transfer & Visiting Application Dashboard
  </h2>
</div>

<div class="grid-cols-3 grid gap-4">
  <Card.Root>
    <Card.Header
      class="flex flex-row items-center justify-between space-y-0 pb-2">
      <Card.Title class="text-sm font-medium">Region</Card.Title>
      <EarthIcon class="h-4 w-4 text-muted-foreground" />
    </Card.Header>
    <Card.Content>
      <div class="text-2xl font-bold">
        {data.user_updated?.region_id || "N/A"}
      </div>
    </Card.Content>
  </Card.Root>
  <Card.Root>
    <Card.Header
      class="flex flex-row items-center justify-between space-y-0 pb-2">
      <Card.Title class="text-sm font-medium">Division</Card.Title>
      <LandPlotIcon class="h-4 w-4 text-muted-foreground" />
    </Card.Header>
    <Card.Content>
      <div class="text-2xl font-bold">
        {data.user_updated?.division_id || "N/A"}
      </div>
    </Card.Content>
  </Card.Root>
  <Card.Root>
    <Card.Header
      class="flex flex-row items-center justify-between space-y-0 pb-2">
      <Card.Title class="text-sm font-medium">Subdivision</Card.Title>
      <TowerControlIcon class="h-4 w-4 text-muted-foreground" />
    </Card.Header>
    <Card.Content>
      <div class="text-2xl font-bold">
        {data.user_updated.subdivision_id || "N/A"}
      </div>
    </Card.Content>
  </Card.Root>
</div>

<div class="grid-cols-2 grid gap-4">
  <Card.Root>
    <Card.Content>
      <Card.Header class="pl-0">
        <Card.Title>Your VATMENA Facility Assignments</Card.Title>
      </Card.Header>
      <AssignmentsTable data={data.facilityAssignments} />
    </Card.Content>
  </Card.Root>

  <Card.Root>
    <Card.Content>
      <Card.Header
        class="flex flex-row items-center justify-between px-0 py-3 space-y-0">
        <Card.Title>Your Cases</Card.Title>
        <Button
          class="mr-0"
          on:click={() => {
            submitNewDialogOpen = true;
          }}>
          Submit New Application
        </Button>
      </Card.Header>
      <CasesTable data={data.tv_cases} />
    </Card.Content>
  </Card.Root>
</div>

<Dialog.Root bind:open={submitNewDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Submit New Application</Dialog.Title>
      <Dialog.Description>
        Please keep in mind that all applications are <i>manually reviewed</i>
        and it may be 1-2 weeks before your application is processed, especially
        if more information is required from you.
      </Dialog.Description>
    </Dialog.Header>
    <p class="text-sm">What would you like to submit an application for?</p>
    {#if data.user_updated?.region_id !== "EMEA"}
      <Button disabled>Transfer to VATMENA</Button>
      <p class="text-xs text-foreground/80">
        If you want to transfer into VATMENA, <a
          class="underline underline-offset-4"
          href="https://cert.vatsim.net/vatsimnet/regch.php">
          submit a region change request on myVATSIM.
        </a>
      </p>
    {:else if data.user_updated?.division_id === "MENA"}
      <Button on:click={() => {
        submitNewDialogOpen = false;
        transferDialogOpen = true;
      }}>Transfer to another vACC within VATMENA</Button>
    {:else}
      <Button on:click={() => {
        submitNewDialogOpen = false;
        transferDialogOpen = true;
      }}>Transfer to VATMENA</Button>
    {/if}
    <Button
      on:click={() => {
        submitNewDialogOpen = false;
        visitFacilityDialogOpen = true;
      }}>
      Visit a VATMENA Facility
    </Button>
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={visitFacilityDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Apply to visit a VATMENA facility</Dialog.Title>
      <Dialog.Description>
        You must meet the requirements below, as outlined by the VATSIM
        Transferring & Visiting Controller Policy, version 2.0, published 20
        March 2024. If you do not meet the requirements, you will not be
        permitted to visit within VATMENA.
      </Dialog.Description>
    </Dialog.Header>

    <p>
      For an <b>
        {data.visitingRequirements.home === "EMEA/MENA"
          ? "internal"
          : "external"}
      </b>
      visiting request, the following requirements apply:
    </p>

    <ul class="space-y-2">
      <li class="flex">
        {#if data.visitingRequirements.home === "EMEA/MENA" && data.visitingRequirements.rating > 2}
          <CircleCheck class="text-green-500 min-w-6 min-h-6 mr-2" />
        {:else if data.visitingRequirements.rating > 3}
          <CircleCheck class="text-green-500 min-w-6 min-h-6 mr-2" />
        {:else}
          <CircleX class="text-red-500 min-w-6 min-h-6 mr-2" />
        {/if}
        <span class="text-foreground/90">
          You hold an {data.visitingRequirements.home === "EMEA/MENA"
            ? "S2"
            : "S3"} rating or higher ({data.visitingRequirements.ratingShort})
        </span>
      </li>
      <li class="flex">
        {#if data.visitingRequirements.fiftyHours}
          <CircleCheck class="text-green-500 min-w-6 min-h-6 mr-2" />
        {:else}
          <CircleX class="text-red-500 min-w-6 min-h-6 mr-2" />
        {/if}
        <span class="text-foreground/90">
          You have logged {(
            data.visitingRequirements.total_time /
            60 /
            60
          ).toFixed(1)}/{data.visitingRequirements.required / 60 / 60} hours since
          your last rating upgrade
        </span>
      </li>
      <li class="flex">
        {#if data.visitingRequirements.fiftyHours}
          <CircleCheck class="text-green-500 min-w-6 min-h-6 mr-2" />
        {:else}
          <CircleX class="text-red-500 min-w-6 min-h-6 mr-2" />
        {/if}
        <span class="text-foreground/90">
          You have logged {(
            data.visitingRequirements.hours_in_last_6mo /
            60 /
            60
          ).toFixed(1)}/{data.visitingRequirements.required_hrs_in_last_6mo /
            60 /
            60} hours in the last 6 months
        </span>
      </li>

      <li class="flex">
        {#if data.visitingRequirements.canVisit}
          <CircleCheck class="text-green-500 min-w-6 min-h-6 mr-2" />
        {:else}
          <CircleX class="text-red-500 min-w-6 min-h-6 mr-2" />
        {/if}
        <span class="text-foreground/90">
          Do you meet all of the above requirements?
        </span>
      </li>
    </ul>

    {#if data.visitingRequirements.canVisit}
      <Button href="/tvc/apply/visit">Submit a Visiting Application</Button>
    {:else}
      <Button disabled>You do not meet the visiting requirements :(</Button>
    {/if}
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={transferDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Apply to transfer to a VATMENA facility</Dialog.Title>
      <Dialog.Description>
        You must meet the requirements below, as outlined by the VATSIM
        Transferring & Visiting Controller Policy, version 2.0, published 20
        March 2024. If you do not meet the requirements, you will not be
        permitted to transfer.
      </Dialog.Description>
    </Dialog.Header>

    <p>
      For an <b>
      {data.visitingRequirements.home === "EMEA/MENA"
        ? "internal"
        : "external"}
    </b>
      transfer request, the following requirements apply:
    </p>

    <ul class="space-y-2">
      <li class="flex">
        {#if data.visitingRequirements.fiftyHours}
          <CircleCheck class="text-green-500 min-w-6 min-h-6 mr-2" />
        {:else}
          <CircleX class="text-red-500 min-w-6 min-h-6 mr-2" />
        {/if}
        <span class="text-foreground/90">
          You have logged {(
          data.visitingRequirements.total_time /
          60 /
          60
        ).toFixed(1)}/{data.visitingRequirements.required / 60 / 60} hours since
          your last rating upgrade
        </span>
      </li>
      <li class="flex">
        {#if data.visitingRequirements.fiftyHours}
          <CircleCheck class="text-green-500 min-w-6 min-h-6 mr-2" />
        {:else}
          <CircleX class="text-red-500 min-w-6 min-h-6 mr-2" />
        {/if}
        <span class="text-foreground/90">
          You have logged {(
          data.visitingRequirements.hours_in_last_6mo /
          60 /
          60
        ).toFixed(1)}/{data.visitingRequirements.required_hrs_in_last_6mo /
        60 /
        60} hours in the last 6 months
        </span>
      </li>
      <li class="flex">
        {#if data.transferRequirements.ninetyDaysSinceLastRatingUpdate}
          <CircleCheck class="text-green-500 min-w-6 min-h-6 mr-2" />
        {:else}
          <CircleX class="text-red-500 min-w-6 min-h-6 mr-2" />
        {/if}
        <span class="text-foreground/90">
          It has been 90 days since your last rating upgrade or transfer attempt
        </span>
      </li>
      <li class="flex">
        {#if data.transferRequirements.canTransfer}
          <CircleCheck class="text-green-500 min-w-6 min-h-6 mr-2" />
        {:else}
          <CircleX class="text-red-500 min-w-6 min-h-6 mr-2" />
        {/if}
        <span class="text-foreground/90">
          Do you meet all of the above requirements?
        </span>
      </li>
    </ul>

    {#if data.transferRequirements.canTransfer}
      <Button href="/tvc/apply/visit">Submit a Transfer Application</Button>
    {:else}
      <Button disabled>You do not meet the transfer requirements :(</Button>
    {/if}
  </Dialog.Content>
</Dialog.Root>
