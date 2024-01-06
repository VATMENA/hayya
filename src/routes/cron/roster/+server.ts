import { VATSIM_CORE_API_TOKEN } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { ROLE_CONTROLLER_ID, ROLE_MEMBER_ID } from "$lib/roles";

export const GET: RequestHandler = async () => {
  console.log("[RosterUpdate] Roster update task started");

  let initial_vatsim_resp = await fetch(
    "https://api.vatsim.net/v2/orgs/division/MENA?limit=1",
    {
      headers: {
        "X-API-Key": VATSIM_CORE_API_TOKEN,
      },
    },
  );

  let initial_json = await initial_vatsim_resp.json();

  if (!initial_vatsim_resp.ok) {
    throw new Error(JSON.stringify(initial_json));
  }

  let need_to_pull = initial_json.count;

  let real_roster_resp = await fetch(
    `https://api.vatsim.net/v2/orgs/division/MENA?limit=${need_to_pull}`,
    {
      headers: {
        "X-API-Key": VATSIM_CORE_API_TOKEN,
      },
    },
  );

  let roster_json = await real_roster_resp.json();

  if (!real_roster_resp.ok) {
    throw new Error(JSON.stringify(roster_json));
  }

  let roster = roster_json.items;

  let existing_roster = {};
  let existing_roster_arr = await prisma.user.findMany();
  for (let existing_user of existing_roster_arr) {
    existing_roster[existing_user.id.toString()] = existing_user;
  }

  let vaccs = {};
  let vaccs_arr = await prisma.vacc.findMany();
  for (let vacc of vaccs_arr) {
    vaccs[vacc.id] = vacc;
  }

  let ratings = [
    ["SUS", "Suspended"],
    ["OBS", "Observer"],
    ["S1", "Tower Trainee"],
    ["S2", "Tower Controller"],
    ["S3", "Senior Student"],
    ["C1", "Enroute Controller"],
    ["C2", "Controller 2 (not in use)"],
    ["C3", "Senior Controller"],
    ["I1", "Instructor"],
    ["I2", "Instructor 2 (not in use)"],
    ["I3", "Senior Instructor"],
    ["SUP", "Supervisor"],
    ["ADM", "Administrator"],
  ];

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let total = 0;

  for (let roster_user of roster) {
    total += 1;
    let should_have_roles = [];
    if (roster_user.division_id == "MENA") {
      should_have_roles.push(ROLE_CONTROLLER_ID);
    } else {
      should_have_roles.push(ROLE_MEMBER_ID);
    }

    let vacc =
      roster_user.subdivision_id === null
        ? null
        : Object.keys(vaccs).includes(roster_user.subdivision_id)
        ? roster_user.subdivision_id
        : null;

    if (Object.keys(existing_roster).includes(roster_user.id.toString())) {
      let updated_roleIds = existing_roster[roster_user.id.toString()].roleIds;

      for (let role of should_have_roles) {
        if (!updated_roleIds.includes(role)) {
          updated_roleIds.push(role);
        }
      }

      let existing = existing_roster[roster_user.id.toString()];

      // Janky bizzaro way of not updating unchanged users

      let new_data = {
        name: `${roster_user.name_first} ${roster_user.name_last}`,
        ratingId: roster_user.rating,
        ratingShort: ratings[roster_user.rating][0],
        ratingLong: ratings[roster_user.rating][1],
        region: roster_user.region_id,
        division: roster_user.division_id,
        roleIds: updated_roleIds,
        vaccId: vacc,
      };

      let compare_array = [
        [existing.name, new_data.name],
        [existing.ratingId, new_data.ratingId],
        [existing.ratingShort, new_data.ratingShort],
        [existing.ratingLong, new_data.ratingLong],
        [existing.region, new_data.region],
        [existing.division, new_data.division],
        [existing.roleIds, new_data.roleIds],
        [existing.vaccId, new_data.vaccId],
      ];
      for (let [before, after] of compare_array) {
        if (before !== after) {
          await prisma.user.update({
            where: { id: roster_user.id.toString() },
            data: new_data,
          });

          console.log(`[RosterUpdate] Updated existing user ${roster_user.id}`);
          updated += 1;
          break;
        }
      }
      skipped += 1;
    } else {
      await prisma.user.create({
        data: {
          id: roster_user.id.toString(),
          name: `${roster_user.name_first} ${roster_user.name_last}`,
          ratingId: roster_user.rating,
          ratingShort: ratings[roster_user.rating][0],
          ratingLong: ratings[roster_user.rating][1],
          region: roster_user.region_id,
          division: roster_user.division_id,
          roleIds: should_have_roles,
          vaccId: vacc,
        },
      });

      console.log(`[RosterUpdate] Created new user ${roster_user.id}`);
      created += 1;
    }
  }

  console.log(
    `[RosterUpdate] Roster update task finished\tcreated=${created} updated=${updated} skipped=${skipped} total=${total}/${
      created + updated + skipped
    }`,
  );

  return new Response("");
};
