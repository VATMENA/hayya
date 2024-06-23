<script lang="ts">
  import type { PageData } from "./$types";
  import { CalendarDate } from "@internationalized/date";
  import * as Accordion from "$lib/components/ui/accordion";
  import Markdown from "$lib/components/Markdown.svelte";
  import { TRAIN } from "$lib/perms/permissions";
  import { can } from "$lib/perms/can";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";

  export let data: PageData;
  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addItem($page.data.url, `/${data.facility.id}`, "Dashboard");
    addItem($page.data.url, `/${data.facility.id}/training`, "Training");
    if (data.targetUser.id === data.user.id) {
      addPage($page.data.url, "My Transcript");
    } else {
      addItem(
        $page.data.url,
        `/${data.facility.id}/user/${data.targetUser.id}/`,
        data.targetUser.name,
      );
      addPage($page.data.url, "Training Transcript");
    }
  }

  function convertDate(date: Date): string {
    return date.toDateString();
  }
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">
    Training Transcript for {data.targetUser.name}
  </h2>
</div>

<Accordion.Root>
  {#each data.sessions as session}
    <Accordion.Item value={session.id}>
      <Accordion.Trigger>
        {#if session.logType === "Training"}
          {convertDate(session.date)} - {session.sessionType} session with {session
            .instructor.name}
        {:else if session.logType === "CertificateRevokal"}
          {convertDate(session.date)} - {session.sessionType} certificate revoked
          by {session.instructor.name}
        {/if}
      </Accordion.Trigger>
      <Accordion.Content>
        <div class="grid-cols-{can(TRAIN) ? '2' : '1'} grid gap-4">
          <div>
            <p class="font-semibold text-foreground/40">COMMENTS</p>
            <div
              class="relative mb-5 mt-2 h-[150px] overflow-auto rounded bg-muted p-[0.5rem] text-sm">
              <Markdown src={session.studentComments} />
            </div>
          </div>
          {#if can(TRAIN)}
            <div>
              <p class="font-semibold text-foreground/40">
                PRIVATE MENTOR NOTES
              </p>
              <div
                class="relative mb-5 mt-2 h-[150px] overflow-auto rounded bg-muted p-[0.5rem] text-sm">
                <Markdown src={session.instructorComments} />
              </div>
            </div>
          {/if}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>
