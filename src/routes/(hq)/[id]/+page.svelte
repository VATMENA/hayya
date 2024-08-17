<script lang="ts">
  import type { PageData } from "./$types";
  import { addItem, addPage, clearItems } from "$lib/breadcrumbs";
  import { page } from "$app/stores";
  import * as Card from "$lib/components/ui/card";
  import * as Table from "$lib/components/ui/table";
  import type { Certificate, User } from "@prisma/client";
  import CertificateBadge from "./CertificateBadge.svelte";

  export let data: PageData;

  $: {
    clearItems($page.data.url);
    addItem($page.data.url, "/switch_hq", data.facility.name);
    addPage($page.data.url, "Dashboard");
  }

  type C = Certificate & { instructor: User };

  let facilCerts: Record<string, C[]>;

  function calcFcerts(dat: C[]): Record<string, C[]> {
    let data: Record<string, C[]> = {};

    for (let c of dat) {
      if (!Object.keys(data).includes(c.issuedInId)) {
        data[c.issuedInId] = [];
      }
      data[c.issuedInId].push(c);
    }

    return data;
  }

  $: facilCerts = calcFcerts(data.certs);
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">Hello, {data.user.name}</h2>
</div>

<div class="flex flex-col gap-4">
  <Card.Root>
    <Card.Header>
      <Card.Title>{data.user.name} ({data.user.id})</Card.Title>
    </Card.Header>
    <Card.Content>
      <div class="flex flex-col gap-2 md:flex-row">
        <div class="flex flex-col gap-2 text-sm">
          <p>
            <b>Full Name:</b>
            {data.user.name}
          </p>
          <p>
            <b>VATSIM CID:</b>
            {data.user.id}
          </p>
          <p>
            <b>Division:</b>
            {data.user.region}-{data.user.division}
          </p>
        </div>
        <div class="flex flex-col gap-2 text-sm">
          <p>
            <b>Rating:</b>
            {data.user.ratingLong} ({data.user.ratingShort})
          </p>
          <p>
            <b>Statistics:</b>
            <a
              class="underline underline-offset-4"
              href="https://stats.vatsim.net/stats/{data.user.id}">
              View Your Stats
            </a>
          </p>
        </div>
      </div>
    </Card.Content>
  </Card.Root>

  <div class="flex flex-col gap-4 md:flex-row">
    <Card.Root class="flex-1">
      <Card.Header>
        <Card.Title>Your Certificates</Card.Title>
      </Card.Header>
      <Card.Content>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Facility</Table.Head>
              <Table.Head>Certificates</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each Object.entries(facilCerts) as [fid, ca]}
              <Table.Row>
                <Table.Cell>{fid}</Table.Cell>
                <Table.Cell>
                  {#each ca as c}
                    <CertificateBadge cert={c} holder={data.user} />
                  {/each}
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </Card.Content>
    </Card.Root>
  </div>
</div>
