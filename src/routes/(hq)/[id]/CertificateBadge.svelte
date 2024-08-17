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
  import Calendar from "lucide-svelte/icons/calendar";
  import Clock from "lucide-svelte/icons/clock";
  import FileBadge2 from "lucide-svelte/icons/file-badge-2";
  import TowerControl from "lucide-svelte/icons/tower-control";
  import UserRound from "lucide-svelte/icons/user-round";
  import { page } from "$app/stores";
  import { can } from "$lib/perms/can";
  import {
    REVOKE_CERTIFICATE,
    REVOKE_OPENSKIES_CERTIFICATES,
    REVOKE_SOLO_CERTIFICATES,
  } from "$lib/perms/permissions";
  // @formatter:off
  import * as Dialog from "$lib/components/ui/dialog";
  import * as HoverCard from "$lib/components/ui/hover-card";
  // @formatter:on

  export let cert: Certificate & { instructor: User };
  export let holder: User;

  let parsed_position: PositionV2 | null = null;
  let color = "";
  let str_name = "";
  let short_name = "";
  let valid_in = "";
  let can_revoke = false;

  function colorVariants(p_typ: P_TYP, reg: string, t1: string, t2: string) {
    if (p_typ === P_TYP.Tier1) {
      return reg + " " + t1;
    } else if (p_typ === P_TYP.Tier2) {
      return reg + " " + t2;
    } else {
      return reg;
    }
  }

  function c(p: PositionV2, c: string) {
    let out = [c];

    if (p.c_typ === C_TYP.Solo) {
      out.push("border-2 border-dashed border-yellow-500");
    } else if (p.p_typ === P_TYP.Tier1) {
      out.push("border-2 border-dotted border-yellow-500");
    } else if (p.p_typ === P_TYP.Tier2) {
      out.push("border-2 border-solid border-yellow-500");
    }

    return out.join(" ");
  }

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
          str_name += `Tier 1 ${parsed_position.facility} `;
          short_name += "T1-";
          short_name += parsed_position.facility;
          short_name += "-";
          valid_in = cert.issuedInId;
        } else if (parsed_position.p_typ === P_TYP.Tier2) {
          str_name += "Tier 2 ";
          short_name += "T2-";
          valid_in = cert.issuedInId;
        } else if (parsed_position.p_typ === P_TYP.Specific) {
          str_name += parsed_position.facility + " ";
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

        let t1_style = "border border-2 border-dashed border-red-400";

        let styles = new Map([
          [P_TYP.Tier1, "border border-2 border-dashed border-red-400"],
          [P_TYP.Tier2, "border border-2 border-dashed border-green-400"],
        ]);

        if (parsed_position.position === POS.Delivery) {
          short_name += "DEL";
          str_name += "Delivery";
          color = c(parsed_position, "bg-blue-500");
        } else if (parsed_position.position === POS.Ground) {
          short_name += "GND";
          str_name += "Ground";
          color = c(parsed_position, "bg-green-500");
        } else if (parsed_position.position === POS.Tower) {
          short_name += "TWR";
          str_name += "Tower";
          color = c(parsed_position, "bg-red-500");
        } else if (parsed_position.position === POS.Approach) {
          short_name += "APP";
          str_name += "App/Dep";
          color = c(parsed_position, "bg-cyan-500");
        } else if (parsed_position.position === POS.OpenskiesEnroute) {
          short_name += "CTR";
          str_name += "Enroute";
          color = c(parsed_position, "bg-fuchsia-500");
        }
      } else if (parsed_position.p_typ === P_TYP.SuperCenter) {
        str_name += `${parsed_position.facility} Enroute (SuperCenter)`;
        short_name += `${parsed_position.facility}-SUPERCTR`;
        color = "bg-pink-500";
        valid_in = cert.issuedInId;
      }
    }
    if (!valid_in) {
      valid_in = $page.data.vacc_id;
    }
  }
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
    </HoverCard.Content>
  </HoverCard.Root>
{/if}
