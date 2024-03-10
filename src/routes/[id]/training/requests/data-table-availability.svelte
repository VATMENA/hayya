<script lang="ts">
  import type { TrainingRequest } from "@prisma/client";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { humanReadableDateOnly } from "$lib/date";

  export let request: TrainingRequest;
</script>

<ScrollArea class="max-w-96">
  From {humanReadableDateOnly(request.startDate)} to {humanReadableDateOnly(
    request.endDate,
  )}.
  <br />
  {request.availability}
</ScrollArea>
