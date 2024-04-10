<script lang="ts">
  // @formatter:off
  import * as Card from "$lib/components/ui/card";
  // @formatter:on
  import { Button } from "$lib/components/ui/button";
  import VisitForm from "./VisitForm.svelte";
  import type {PageData} from "./$types";

  export let data: PageData;
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">Submit a new visiting application</h2>
</div>

<VisitForm data={data.form} />