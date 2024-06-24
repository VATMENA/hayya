<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import type { PageData } from "./$types";
  import Check from "lucide-svelte/icons/check";
  import ChevronRight from "lucide-svelte/icons/chevron-right";
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import { tick } from "svelte";
  // @formatter:off
  import * as Card from "$lib/components/ui/card";
  import * as Popover from "$lib/components/ui/popover";
  import * as Command from "$lib/components/ui/command";
  // @formatter:on
  import { cn } from "$lib/utils";
  import { goto } from "$app/navigation";

  export let data: PageData;

  interface DropdownItem {
    value: string;
    label: string;
  }

  let all_facilities: DropdownItem[] = [];
  let visible_facilities: DropdownItem[] = [];

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

<div class="flex h-full flex-col items-center justify-center space-y-4 p-6">
  <Card.Root class="content-center justify-center">
    <Card.Header>
      <Card.Title>
        Hi, {data.user.name}! What are you looking to do today?
      </Card.Title>
    </Card.Header>
    <Card.Content class="flex flex-col gap-4 xl:flex-row">
      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-bold">Log into a facility HQ</h3>

        <Popover.Root bind:open={hqopen} let:ids>
          <div class="grid grid-cols-4 gap-2">
            <Popover.Trigger asChild let:builder>
              <Button
                builders={[builder]}
                variant="outline"
                role="combobox"
                aria-expanded={hqopen}
                class="col-span-3 w-full justify-between">
                {hqselectedValue}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </Popover.Trigger>
            <Button
              variant="outline"
              on:click={() => {
                goto(`/${hqvalue}`);
              }}>
              Go
              <ChevronRight class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </div>

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
      </div>

      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-bold">View the roster of a facility</h3>
        <Popover.Root bind:open={rosteropen} let:ids>
          <div class="grid grid-cols-4 gap-2">
            <Popover.Trigger asChild let:builder>
              <Button
                builders={[builder]}
                variant="outline"
                role="combobox"
                aria-expanded={rosteropen}
                class="col-span-3 w-full justify-between">
                {rosterselectedValue}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </Popover.Trigger>
            <Button
              variant="outline"
              on:click={() => {
                goto(`/${rostervalue}/roster`);
              }}>
              Go <ChevronRight
                class="ml-2 h-4 w-4 shrink-0 align-middle opacity-50" />
            </Button>
          </div>
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
      </div>
      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-bold">
          Apply to visit or transfer to a facility
        </h3>
        <Button variant="outline" href="/tvc/" class="w-full">
          T&V Dashboard <ChevronRight class="h-5 w-5 font-light" />
        </Button>
      </div>
    </Card.Content>
  </Card.Root>
</div>
