import { VATSIM_CORE_API_TOKEN } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { UserFacilityAssignment } from "@prisma/client";
import {ulid} from "ulid";

export const GET: RequestHandler = async () => {
  console.log("[RosterUpdate] Roster update task started");

  let facilities = await prisma.facility.findMany({
    include: {
      users: {
        include: {
          user: true
        }
      }
    }
  });

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

  let all_existing_users = await prisma.user.findMany();

  for (let facility of facilities) {

    let dotnetUrl = `https://api.vatsim.net/v2/orgs/${facility.dotnetType === "Division" ? "division" : "subdivision"}/${facility.dotnetId}`;

    let initial_vatsim_resp = await fetch(
        `${dotnetUrl}?limit=1`,
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
        `${dotnetUrl}?limit=${need_to_pull}`,
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

    for (let roster_user of roster) {

      let already_existed = false;

      for (let existing_user of all_existing_users) {
        if (existing_user.id === roster_user.id) {
          // update if any details changed
          let checklist = [
              [existing_user.name, `${roster_user.name_first} ${roster_user.name_last}`],
              [existing_user.ratingId, ]
          ]
          already_existed = true;
          break;
        }
      }

      if (!already_existed) {
        // create
        await prisma.user.create({
          data: {
            id: roster_user.id,

          }
        })
      }

      let facilityAssignment: UserFacilityAssignment = {
        id: ulid(),
        assignmentType: "Primary",
        userId: roster_user.id,

      };
    }

  }/*

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


  }*/

  console.log(
    `[RosterUpdate] Roster update task finished`
  );

  return new Response("");
};
