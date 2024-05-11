<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import DataTable from "./data-table.svelte";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";

  export let data: PageData;
  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addPage($page.data.url, "Roster");
  }

  let error: string | null = null;

  async function toggleRole(
    cid: string,
    existing_roles: string[],
    new_role: string,
  ) {
    let new_roles = [];
    if (existing_roles.includes(new_role)) {
      for (let item of existing_roles) {
        if (item != new_role) {
          new_roles.push(item);
        }
      }
    } else {
      new_roles = existing_roles;
      new_roles.push(new_role);
    }
    let data = new URLSearchParams();
    data.set("user", cid);
    data.set("roles", new_roles.join(","));

    let resp = await fetch("?/set_roles", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data.toString(),
    });
    if (!resp.ok) {
      throw new Error(
        "server returned error response, see console for details",
      );
    }
    window.location.reload();
  }
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">
    Facility Roster - {$page.params.id}
  </h2>
</div>

<DataTable data={data.users} />
