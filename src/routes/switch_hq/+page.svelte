<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import type { PageData } from "./$types";
  import Check from "lucide-svelte/icons/check";
  import ChevronRight from "lucide-svelte/icons/chevron-right";
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import LogIn from "lucide-svelte/icons/log-in";
  import { tick } from "svelte";
  import * as Popover from "$lib/components/ui/popover";
  import * as Command from "$lib/components/ui/command";
  import { cn } from "$lib/utils";
  import { goto } from "$app/navigation";

  export let data: PageData;

  let all_facilities = [];
  let visible_facilities = [];

  $: {
    let user_facility_ids = [];
    for (let facility of data.user.facilities) {
      user_facility_ids.push(facility.facility.id);
    }

    for (let facility of data.facilities) {
      all_facilities.push({
        value: facility.id,
        label: facility.name,
      });
      if (user_facility_ids.includes(facility.id)) {
        visible_facilities.push({
          value: facility.id,
          label: facility.name,
        });
      }
    }

    all_facilities = all_facilities;
    visible_facilities = visible_facilities;
  }

  let rosteropen = false;
  let rostervalue = "";

  $: rosterselectedValue =
    all_facilities.find((f) => f.value === rostervalue)?.label ??
    "Select a facility...";

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function rostercloseAndFocusTrigger(triggerId: string) {
    rosteropen = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }

  let hqopen = false;
  let hqvalue = "";

  $: hqselectedValue =
    visible_facilities.find((f) => f.value === hqvalue)?.label ??
    "Select a facility...";

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function hqcloseAndFocusTrigger(triggerId: string) {
    hqopen = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>

<div
  class="h-screen w-1/2 min-w-[40rem] flex flex-col p-6 space-y-4 items-center justify-center">
  <Card.Root class="justify-center content-center">
    <Card.Header>
      <Card.Title>
        Hi, {data.user.name}! What are you looking to do today?
      </Card.Title>
    </Card.Header>
    <Card.Content class="grid space-y-4">
      <div class="grid grid-rows-2 gap-4">
        <div class="grid grid-cols-3 gap-4">
          <h3 class="font-bold text-lg mb-2">Log into a facility HQ</h3>
          <h3 class="font-bold text-lg mb-2">View the roster of a facility</h3>
          <h3 class="font-bold text-lg">
            Apply to visit or transfer to a facility
          </h3>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <Popover.Root bind:open={hqopen} let:ids>
            <Popover.Trigger asChild let:builder>
              <Button
                builders={[builder]}
                variant="outline"
                role="combobox"
                aria-expanded={hqopen}
                class="w-full justify-between">
                {hqselectedValue}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </Popover.Trigger>
            <Popover.Content class="w-[200px] p-0">
              <Command.Root>
                <Command.Input placeholder="Search facilities..." />
                <Command.Empty>No facility found.</Command.Empty>
                <Command.Group>
                  {#each visible_facilities as facility}
                    <Command.Item
                      value={facility.value}
                      onSelect={(currentValue) => {
                        hqvalue = currentValue;
                        hqcloseAndFocusTrigger(ids.trigger);
                        goto(`/${currentValue}/`);
                      }}>
                      <Check
                        class={cn(
                          "mr-2 h-4 w-4",
                          hqvalue !== facility.value && "text-transparent",
                        )} />
                      {facility.label}
                    </Command.Item>
                  {/each}
                </Command.Group>
              </Command.Root>
            </Popover.Content>
          </Popover.Root>

          <Popover.Root bind:open={rosteropen} let:ids>
            <Popover.Trigger asChild let:builder>
              <Button
                builders={[builder]}
                variant="outline"
                role="combobox"
                aria-expanded={rosteropen}
                class="w-full justify-between">
                {rosterselectedValue}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </Popover.Trigger>
            <Popover.Content class="w-[200px] p-0">
              <Command.Root>
                <Command.Input placeholder="Search facilities..." />
                <Command.Empty>No facility found.</Command.Empty>
                <Command.Group>
                  {#each all_facilities as facility}
                    <Command.Item
                      value={facility.value}
                      onSelect={(currentValue) => {
                        rostervalue = currentValue;
                        rostercloseAndFocusTrigger(ids.trigger);
                        goto(`/${currentValue}/roster/`);
                      }}>
                      <Check
                        class={cn(
                          "mr-2 h-4 w-4",
                          rostervalue !== facility.value && "text-transparent",
                        )} />
                      {facility.label}
                    </Command.Item>
                  {/each}
                </Command.Group>
              </Command.Root>
            </Popover.Content>
          </Popover.Root>
          <Button variant="outline" href="/tvc/" class="w-full">
            T&V Dashboard <ChevronRight class="w-5 h-5 font-light" />
          </Button>
        </div>
      </div>
    </Card.Content>
  </Card.Root>
</div>
