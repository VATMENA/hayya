<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import SquareUserIcon from "lucide-svelte/icons/square-user";
  import TowerControlIcon from "lucide-svelte/icons/tower-control";
  import UserIcon from "lucide-svelte/icons/user";
  import NetworkIcon from "lucide-svelte/icons/network";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">Site Administration</h2>
</div>

<div class="grid-cols-4 grid gap-4">
  <Card.Root>
    <Card.Header
      class="flex flex-row items-center justify-between space-y-0 pb-2">
      <Card.Title class="text-sm font-medium">Users</Card.Title>
      <UserIcon class="h-4 w-4 text-muted-foreground" />
    </Card.Header>
    <Card.Content>
      <div class="text-2xl font-bold">{data.totalUsers}</div>
      <a
        href="/admin/users"
        class="text-sm text-foreground/80 underline underline-offset-4">
        Manage Users &rarr;
      </a>
    </Card.Content>
  </Card.Root>
  <Card.Root>
    <Card.Header
      class="flex flex-row items-center justify-between space-y-0 pb-2">
      <Card.Title class="text-sm font-medium">Facilities</Card.Title>
      <TowerControlIcon class="h-4 w-4 text-muted-foreground" />
    </Card.Header>
    <Card.Content>
      <div class="text-2xl font-bold">{data.totalFacilities}</div>
      <a
        href="/admin/facilities"
        class="text-sm text-foreground/80 underline underline-offset-4">
        Manage Facilities &rarr;
      </a>
    </Card.Content>
  </Card.Root>
  <Card.Root>
    <Card.Header
      class="flex flex-row items-center justify-between space-y-0 pb-2">
      <Card.Title class="text-sm font-medium">Staff Authorizations</Card.Title>
      <SquareUserIcon class="h-4 w-4 text-muted-foreground" />
    </Card.Header>
    <Card.Content>
      <div class="text-2xl font-bold">{data.divisionStaffAuthorizations}</div>
      <a
        href="/admin/division_staff"
        class="text-sm text-foreground/80 underline underline-offset-4">
        Manage Staff Authorizations &rarr;
      </a>
    </Card.Content>
  </Card.Root>
  <Card.Root>
    <Card.Header
      class="flex flex-row items-center justify-between space-y-0 pb-2">
      <Card.Title class="text-sm font-medium">Site Administrators</Card.Title>
      <UserIcon class="h-4 w-4 text-muted-foreground" />
    </Card.Header>
    <Card.Content>
      <div class="text-2xl font-bold">{data.siteAdministrators}</div>
      <a
        href="/admin/admins"
        class="text-sm text-foreground/80 underline underline-offset-4">
        Manage Site Administrators &rarr;
      </a>
    </Card.Content>
  </Card.Root>
  <Card.Root>
    <Card.Header
      class="flex flex-row items-center justify-between space-y-0 pb-2">
      <Card.Title class="text-sm font-medium">Active Connections</Card.Title>
      <NetworkIcon class="h-4 w-4 text-muted-foreground" />
    </Card.Header>
    <Card.Content>
      <div class="text-2xl font-bold">{data.connections}</div>
      <a
        href="/admin/connections"
        class="text-sm text-foreground/80 underline underline-offset-4">
        See Active Connections &rarr;
      </a>
    </Card.Content>
  </Card.Root>
</div>

<div class="grid-cols-3 grid gap-4"></div>
