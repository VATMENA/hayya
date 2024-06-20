<script lang="ts">
  import {
    type Certificate,
    type User,
    type UserFacilityAssignment,
    type Role,
  } from "@prisma/client";
  import {
    createRender,
    createTable,
    Render,
    Subscribe,
  } from "svelte-headless-table";
  import { writable } from "svelte/store";
  import DataTableUser from "./data-table-user.svelte";
  import DataTableRating from "./data-table-rating.svelte";
  import DataTableCertificates from "./data-table-certificates.svelte";
  import DataTableActions from "./data-table-actions.svelte";
  import { addPagination, addTableFilter } from "svelte-headless-table/plugins";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Info } from "lucide-svelte";
  import CertificateBadge from "./CertificateBadge.svelte";
  import { page } from "$app/stores";
  import { C_TYP, P_TYP, POS, serialize_position_v2 } from "$lib/cert";
  // @formatter:off
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Table from "$lib/components/ui/table";
  import type { RosterUser } from "./+page.server";
  // @formatter:on

  export let data: RosterUser[];

  let store = writable(data);

  $: $store = data;

  const table = createTable(store, {
    page: addPagination(),
    filter: addTableFilter({
      fn: ({ filterValue, value }) =>
        value.toLowerCase().includes(filterValue.toLowerCase()),
    }),
  });

  const columns = table.createColumns([
    table.column({
      id: "name",
      accessor: (u) => u,
      header: "Name",
      cell: ({ value }) => {
        return createRender(DataTableUser, { userAssignment: value });
      },
      plugins: {
        filter: {
          getFilterValue: (u) => {
            return `${u.user.name} ${u.user.id}`;
          },
        },
      },
    }),
    table.column({
      id: "rating",
      accessor: (u) => u.user.ratingShort,
      header: "Rating",
      cell: ({ value }) => {
        return createRender(DataTableRating, { rating: value });
      },
      plugins: {
        filter: {
          exclude: true,
        },
      },
    }),
    table.column({
      accessor: (u) => u,
      header: "Certificates",
      cell: ({ value }) => {
        return createRender(DataTableCertificates, {
          heldCertificates: value.user.heldCertificates,
          holder: value.user,
        });
      },
      plugins: {
        filter: {
          exclude: true,
        },
      },
    }),
    table.column({
      accessor: (u) => u,
      header: "",
      cell: ({ value }) => {
        return createRender(DataTableActions, { user: value });
      },
      plugins: {
        filter: {
          exclude: true,
        },
      },
    }),
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
    table.createViewModel(columns);

  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
  const { filterValue } = pluginStates.filter;

  let basicExampleCert: Certificate & { instructor: User } = {
    id: BigInt(1),
    position: serialize_position_v2({
      c_typ: C_TYP.Permanent,
      p_typ: P_TYP.Unrestricted,
      position: POS.Tower,
      facility: null,
    })!,
    expires: null,
    instructorComments: "Instructor comments will appear here!",
    instructorId: $page.data.user.id,
    holderId: $page.data.user.id,
    issuedInId: $page.params.id,
    createdAt: new Date(),
    instructor: $page.data.user,
  };
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  let soloExampleCert: Certificate & { instructor: User } = {
    id: BigInt(1),
    position: serialize_position_v2({
      c_typ: C_TYP.Solo,
      p_typ: P_TYP.Unrestricted,
      position: POS.Ground,
      facility: null,
    })!,
    expires: tomorrow,
    instructorComments: "Instructor comments will appear here!",
    instructorId: $page.data.user.id,
    holderId: $page.data.user.id,
    issuedInId: $page.params.id,
    createdAt: new Date(),
    instructor: $page.data.user,
  };
  let tier2ExampleCert: Certificate & { instructor: User } = {
    id: BigInt(1),
    position: serialize_position_v2({
      c_typ: C_TYP.Permanent,
      p_typ: P_TYP.Tier2,
      position: POS.Approach,
      facility: null,
    })!,
    expires: null,
    instructorComments: "Instructor comments will appear here!",
    instructorId: $page.data.user.id,
    holderId: $page.data.user.id,
    issuedInId: $page.params.id,
    createdAt: new Date(),
    instructor: $page.data.user,
  };
  let tier1ExampleCert: Certificate & { instructor: User } = {
    id: BigInt(1),
    position: serialize_position_v2({
      c_typ: C_TYP.Permanent,
      p_typ: P_TYP.Tier1,
      position: POS.Delivery,
      facility: "OTHH",
    })!,
    expires: null,
    instructorComments: "Instructor comments will appear here!",
    instructorId: $page.data.user.id,
    holderId: $page.data.user.id,
    issuedInId: $page.params.id,
    createdAt: new Date(),
    instructor: $page.data.user,
  };
  let afspExampleCert: Certificate & { instructor: User } = {
    id: BigInt(1),
    position: serialize_position_v2({
      c_typ: C_TYP.Permanent,
      p_typ: P_TYP.Specific,
      position: POS.Tower,
      facility: "OMDB",
    })!,
    expires: null,
    instructorComments: "Instructor comments will appear here!",
    instructorId: $page.data.user.id,
    holderId: $page.data.user.id,
    issuedInId: $page.params.id,
    createdAt: new Date(),
    instructor: $page.data.user,
  };
  let openskiesExampleCert: Certificate & { instructor: User } = {
    id: BigInt(1),
    position: serialize_position_v2({
      c_typ: C_TYP.Permanent,
      p_typ: P_TYP.OpenSkies,
      position: POS.OpenskiesEnroute,
      facility: null,
    })!,
    expires: null,
    instructorComments: "Instructor comments will appear here!",
    instructorId: $page.data.user.id,
    holderId: $page.data.user.id,
    issuedInId: $page.params.id,
    createdAt: new Date(),
    instructor: $page.data.user,
  };
  let supercenterExampleCert: Certificate & { instructor: User } = {
    id: BigInt(1),
    position: serialize_position_v2({
      c_typ: C_TYP.Permanent,
      p_typ: P_TYP.SuperCenter,
      position: null,
      facility: "GULF",
    })!,
    expires: null,
    instructorComments: "Instructor comments will appear here!",
    instructorId: $page.data.user.id,
    holderId: $page.data.user.id,
    issuedInId: $page.params.id,
    createdAt: new Date(),
    instructor: $page.data.user,
  };
</script>

<div>
  <div
    class="flex flex-col md:flex-row justify-between items-center py-4 gap-y-2">
    <Input
      class="max-w-sm"
      placeholder="Search by name..."
      type="text"
      bind:value={$filterValue} />
    <Dialog.Root>
      <Dialog.Trigger
        class="{buttonVariants({ variant: 'outline' })} w-full md:w-fit">
        <Info class="align-middle mr-2 w-4 h-4" />
        How to read this page
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Understanding the certificates listing</Dialog.Title>
          <Dialog.Description>
            The certificates view can be a little confusing. Here's a key for
            reading the badges.
          </Dialog.Description>
          <div class="text-sm text-muted-foreground leading-6">
            <p>
              A regular certificate will look like this: <CertificateBadge
                holder={$page.data.user}
                cert={basicExampleCert} />
            </p>
            <p>
              You can hover over the certificate to get additional details, like
              who issued it, when it was issued, and any additional restrictions
              or comments the instructor may have added. Try it out!
            </p>
            <hr class="my-2" />
            <p>
              There are also a few other types of certificates. What you saw
              above is an "unrestricted" certificate, which authorizes the
              holder to connect to any position of that type that doesn't have
              additional restrictions.
            </p>
            <p>
              Another type of certificate you will encounter often is a Solo
              certificate. This is a temporary certificate, with an expiry date.
              These will show with a <b>dashed yellow border:</b>
              <CertificateBadge
                holder={$page.data.user}
                cert={soloExampleCert} />
            </p>
            <hr class="my-2" />
            <p>
              A Tier 2 authorization allows the controller to work any Tier 2
              designated position of the same type as the authorization. Tier 2
              certificates appear as a <b>solid yellow border:</b>
              <CertificateBadge
                holder={$page.data.user}
                cert={tier2ExampleCert} />
            </p>
            <hr class="my-2" />
            <p>
              You may also encounter a certificate for a Tier 1 facility, which
              appears with a <b>dotted yellow border:</b>
              <CertificateBadge
                holder={$page.data.user}
                cert={tier1ExampleCert} />
            </p>
            <hr class="my-2" />
            <p>
              There are a few other types of certificates, like <b>
                specific airfield certificates:
              </b>
              <CertificateBadge
                holder={$page.data.user}
                cert={afspExampleCert} />
              <b>OpenSkies endorsements</b>
              : <CertificateBadge
                holder={$page.data.user}
                cert={openskiesExampleCert} />and
              <b>SuperCenter endorsements</b>
              <CertificateBadge
                holder={$page.data.user}
                cert={supercenterExampleCert} />
            </p>
          </div>
        </Dialog.Header>
      </Dialog.Content>
    </Dialog.Root>
  </div>
  <div class="rounded-md border">
    <Table.Root {...$tableAttrs}>
      <Table.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                  <Table.Head {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Head>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Header>
      <Table.Body {...$tableBodyAttrs}>
        {#each $pageRows as row (row.id)}
          <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
            <Table.Row {...rowAttrs}>
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <Table.Cell {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Cell>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
  <div class="flex items-center justify-end space-x-2 py-4">
    <Button
      variant="outline"
      size="sm"
      on:click={() => ($pageIndex = $pageIndex - 1)}
      disabled={!$hasPreviousPage}>
      Previous
    </Button>
    <Button
      variant="outline"
      size="sm"
      disabled={!$hasNextPage}
      on:click={() => ($pageIndex = $pageIndex + 1)}>
      Next
    </Button>
  </div>
</div>
