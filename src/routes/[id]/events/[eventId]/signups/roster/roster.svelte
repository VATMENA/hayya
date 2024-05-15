<script lang="ts">
  import { Prisma, type EventAssignment } from "@prisma/client";
  import "@event-calendar/core/index.css";
  // @ts-ignore
  import Calendar from "@event-calendar/core";
  // @ts-ignore
  import TimeGrid from "@event-calendar/time-grid";
  // @ts-ignore
  import Interaction from "@event-calendar/interaction";
  // @ts-ignore
  import ResourceTimeGrid from "@event-calendar/resource-time-grid";
  import * as Dialog from "$lib/components/ui/dialog";
  import type { PageData } from "./$types";
  import CreateForm from "./create-form.svelte";
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
    import { enhance } from '$app/forms';

  const eventWithSignupsAssignments =
    Prisma.validator<Prisma.EventDefaultArgs>()({
      include: {
        signups: {
          include: {
            user: true,
          },
        },
        assignments: {
          include: {
            user: {
              select: {
                name: true,
                ratingShort: true,
              },
            },
          },
        },
      },
    });
  type Event = Prisma.EventGetPayload<typeof eventWithSignupsAssignments>;

  export let data: PageData;
  export let event: Event;

  let createOpen = false;
  let assignmentDialogOpen = false;
  let assignmentDialogObj: any = {};

  const handleSubmit = () => {
    createOpen = false;
  };

  let currentView = "resourceTimeGridDay";
  const switchView = () => {
    currentView =
      currentView === "resourceTimeGridDay"
        ? "timeGridDay"
        : "resourceTimeGridDay";
    ec.setOption("view", currentView);
  };

  const getColor = (index: number) => {
    const colors = [
      "light blue",
      "purple",
      "orange",
      "blue",
      "green",
      "red",
      "brown"
    ];
    return colors[index % colors.length];
  };

  const getDurationString = (date: Date): string => {
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
  };


  let eventPositions = event.positions.map((position: string, index) => {
    return {
      id: position,
      title: position,
      eventBackgroundColor: getColor(index),
    };
  });

  const eventAssignments = event.assignments.map((assignment: any) => {
    return {
      id: assignment.id,
      title: {
        html: `<strong>${assignment.assignedPosition}</strong> - ${assignment.user.name}`,
      },
      start: assignment.startTime,
      end: assignment.endTime,
      resourceId: assignment.assignedPosition,
      extendedProps: {
        user: assignment.user,
        assignedPosition: assignment.assignedPosition,
      },
    };
  });

  console.log(event.assignments);

  const handleSave = () => {
    const form = document.getElementById('eventsForm') as HTMLFormElement;
    const eventInput = document.getElementById('eventsHiddenInput') as HTMLInputElement;
    
    eventInput.value = JSON.stringify(ec.getEvents());
    form.submit();
    toast.success('Roster has been saved!');
  }

  let ec: any;
  let plugins = [TimeGrid, Interaction, ResourceTimeGrid];
  let options = {
    view: currentView,
    date: event.start,
    allDaySlot: false,
    slotMinTime: getDurationString(event.start),
    slotMaxTime: getDurationString(event.end),
    slotDuration: "00:05:00",
    customButtons: {
      newAssignmentButton: {
        text: "New assignment",
        click: function () {
          createOpen = true;
        },
      },
      switchViewButton: {
        text: "Switch view",
        click: switchView,
      },
      dataButton: {
        text: "Log data",
        click: () => {
          console.log(ec.getEvents());
        },
      },
      saveButton: {
        text: "Save roster",
        click: handleSave,
      }
    },
    headerToolbar: {
      start: "title saveButton",
      center: "",
      end: "newAssignmentButton switchViewButton prev,next",
    },
    events: eventAssignments,
    resources: eventPositions,
    eventDrop: (info: any) => {
      if (info.newResource) {
        const event = info.event;
        event.title = {
          html: `<strong>${info.newResource.id}</strong> - ${info.event.extendedProps.user.name}`,
        };
        event.extendedProps.assignedPosition = info.newResource.id;
        ec.updateEvent(event);
      }
    },
    eventClick: (info: any) => {
      assignmentDialogObj = info.event;
      assignmentDialogOpen = true;
    }
  };
</script>

<div class="grid">
  <Calendar bind:this={ec} {plugins} {options} />
</div>

<form action="?/saveRoster" method="POST" id="eventsForm">
  <input type="hidden" id="eventsHiddenInput" name="events" />
</form>

<Dialog.Root bind:open={createOpen}>
  <Dialog.Content class="max-w-lg">
    <Dialog.Header>
      <Dialog.Title>Create new assignment</Dialog.Title>
    </Dialog.Header>
    <CreateForm data={data.createForm} {event} onSubmit={handleSubmit} />
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={assignmentDialogOpen}>
  <Dialog.Content class="max-w-lg">
    <Dialog.Header>
      <Dialog.Title>Event assignment</Dialog.Title>
      <Dialog.Description>
        {#if assignmentDialogObj}
          <div class="flex flex-col space-y-2">
            <span><strong>Controller: </strong>{assignmentDialogObj.extendedProps.user.name}</span>
            <span><strong>Assigned position: </strong>{assignmentDialogObj.extendedProps.assignedPosition}</span>
          </div>
          <form action="?/deleteAssignment" method="POST">
            <input type="hidden" name="assignmentId" value={assignmentDialogObj.id} />
            <Button variant="destructive" type="submit" class="float-right">Delete</Button>
          </form>
        {/if}
      </Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>

