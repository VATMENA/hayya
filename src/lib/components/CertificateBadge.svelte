<script lang="ts">
  import type { Certificate, User } from "@prisma/client";
  import { Badge } from "$lib/components/ui/badge";
  import {
    C_TYP,
    P_TYP,
    parse_position_v2,
    POS,
    type PositionV2,
  } from "$lib/cert";
  import {
    Calendar,
    Clock,
    FileBadge2,
    TowerControl,
    UserRound,
  } from "lucide-svelte";
  import { page } from "$app/stores";
  import { can } from "$lib/perms/can";
  import {
    REVOKE_CERTIFICATE,
    REVOKE_OPENSKIES_CERTIFICATES,
    REVOKE_SOLO_CERTIFICATES,
  } from "$lib/perms/permissions";
  import { buttonVariants } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import * as HoverCard from "$lib/components/ui/hover-card";

  export let cert: Certificate;
  export let holder: User;

  console.log(cert);

  let parsed_position: PositionV2 | null = null;
  let color = "";
  let str_name = "";
  let short_name = "";
  let valid_in = "";
  let can_revoke = false;
  $: {
    parsed_position = parse_position_v2(cert.position);

    if (parsed_position?.c_typ === C_TYP.Solo) {
      can_revoke = can(REVOKE_SOLO_CERTIFICATES);
    } else if (parsed_position?.p_typ === P_TYP.OpenSkies) {
      can_revoke = can(REVOKE_OPENSKIES_CERTIFICATES);
    } else {
      can_revoke = can(REVOKE_CERTIFICATE);
    }

    color = "";
    str_name = "";
    short_name = "";
    valid_in = cert.issuedInId;

    if (parsed_position !== null) {
      if (parsed_position.c_typ === C_TYP.Solo) {
        str_name = "Solo ";
        short_name = "SOLO-";
      }

      if (parsed_position.p_typ === P_TYP.Enroute) {
        str_name += "Enroute";
        short_name += "CTR";
        color = "bg-fuchsia-500";
        valid_in = cert.issuedInId;
      } else if (
        parsed_position.p_typ === P_TYP.Unrestricted ||
        parsed_position.p_typ === P_TYP.Tier1 ||
        parsed_position.p_typ === P_TYP.Tier2 ||
        parsed_position.p_typ === P_TYP.Specific ||
        parsed_position.p_typ === P_TYP.OpenSkies
      ) {
        if (parsed_position.p_typ === P_TYP.Tier1) {
          str_name += "Tier 1 ";
          short_name += parsed_position.facility;
          short_name += "-";
          valid_in = cert.issuedInId;
        } else if (parsed_position.p_typ === P_TYP.Tier2) {
          str_name += "Tier 2 ";
          short_name += parsed_position.facility;
          short_name += "-";
          valid_in = cert.issuedInId;
        } else if (parsed_position.p_typ === P_TYP.Specific) {
          short_name += parsed_position.facility;
          short_name += "-";
          valid_in = cert.issuedInId;
        } else if (parsed_position.p_typ === P_TYP.OpenSkies) {
          short_name += "OPENSKIES-";
          str_name += "OpenSkies ";
          valid_in = "OpenSkies";
        } else {
          str_name += "Unrestricted ";
        }

        if (parsed_position.position === POS.Delivery) {
          short_name += "DEL";
          str_name += "Delivery";
          color = "bg-blue-500";
        } else if (parsed_position.position === POS.Ground) {
          short_name += "GND";
          str_name += "Ground";
          color = "bg-green-500";
        } else if (parsed_position.position === POS.Tower) {
          short_name += "TWR";
          str_name += "Tower";
          color = "bg-red-500";
        } else if (parsed_position.position === POS.Approach) {
          short_name += "APP";
          str_name += "App/Dep";
          color = "bg-cyan-500";
        } else if (parsed_position.position === POS.Enroute) {
          short_name += "CTR";
          str_name += "Enroute";
          color = "bg-fuchsia-500";
        }
      } else if (parsed_position.p_typ === P_TYP.SuperCenter) {
        str_name += "Enroute (SuperCenter)";
        short_name += "SUPERCTR";
        color = "bg-pink-500";
        valid_in = cert.issuedInId;
      }
    }
    if (!valid_in) {
      valid_in = $page.data.vacc_id;
    }
  }

  let revokeOpen = false;
  let hovercardOpen = false;
</script>

{#if parsed_position !== null && (cert.expires !== null ? cert.expires > new Date() : true)}
  <HoverCard.Root bind:open={hovercardOpen}>
    <HoverCard.Trigger>
      <Badge class={color}>
        {short_name}
      </Badge>
    </HoverCard.Trigger>
    <HoverCard.Content>
      <h4 class="text-md font-semibold">Certificate Info</h4>
      <p class="text-sm">{cert.instructorComments}</p>
      <div class="flex items-center pt-2">
        <UserRound class="mr-2 h-4 w-4 opacity-70" />{" "}
        <span class="text-xs text-muted-foreground">
          Valid For: {holder.name} in {valid_in}
        </span>
      </div>
      <div class="flex items-center pt-2">
        <Clock class="mr-2 h-4 w-4 opacity-70" />{" "}
        <span class="text-xs text-muted-foreground">
          Expires: {cert.expires
            ? cert.expires.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Never"}
        </span>
      </div>
      <div class="flex items-center pt-2">
        <TowerControl class="mr-2 h-4 w-4 opacity-70" />{" "}
        <span class="text-xs text-muted-foreground">
          Position: {str_name}
        </span>
      </div>
      <div class="flex items-center pt-2">
        <UserRound class="mr-2 h-4 w-4 opacity-70" />{" "}
        <span class="text-xs text-muted-foreground">
          Issued By: {cert.instructor.name}
        </span>
      </div>
      <div class="flex items-center pt-2">
        <Calendar class="mr-2 h-4 w-4 opacity-70" />{" "}
        <span class="text-xs text-muted-foreground">
          Issued: {cert.createdAt.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      </div>
      <div class="flex items-center pt-2">
        <FileBadge2 class="mr-2 h-4 w-4 opacity-70" />{" "}
        <span class="text-xs text-muted-foreground">
          Certificate #{cert.id}
        </span>
      </div>
      {#if can_revoke}
        <Button
          on:click={() => {
            hovercardOpen = false;
            revokeOpen = true;
          }}
          class="mt-2 w-full">
          Revoke Certificate
        </Button>
      {/if}
    </HoverCard.Content>
  </HoverCard.Root>
{/if}

{#if can_revoke}
  <Dialog.Root bind:open={revokeOpen}>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>
          This will immediately invalidate the certificate and add a log to the
          user's training transcript that the certificate was revoked.
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Button type="submit" variant="danger">Revoke certificate</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/if}
