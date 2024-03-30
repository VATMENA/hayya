import jwt from "jsonwebtoken";
import { JWT_HMAC_KEY } from "$env/static/private";
import type { Cookies } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import type { Role, User } from "@prisma/client";
import { setUser, setUserRoles } from "$lib/authDual";
import { ulid } from "ulid";

export function makeToken(cid: string): string {
  return jwt.sign({ cid: cid }, JWT_HMAC_KEY);
}

export function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_HMAC_KEY) as { cid: string };
    return decoded.cid;
  } catch {
    return null;
  }
}

export interface UserData {
  user: User;
  roles: Role[];
}

export async function loadUserData(
  cookies: Cookies,
  inFacility: string | null,
): Promise<UserData> {
  if (!cookies.get("hq_token")) {
    redirect(
      307,
      "/",
      { type: "error", message: "You need to be logged in for that" },
      cookies,
    );
  }
  const token = cookies.get("hq_token")!;
  const maybe_cid = verifyToken(token);
  if (maybe_cid === null) {
    redirect(
      307,
      "/",
      { type: "error", message: "You need to be logged in for that" },
      cookies,
    );
  }
  const user = await prisma.user.findUnique({
    where: {
      id: maybe_cid,
    },
    include: {
      facilities: {
        include: {
          roles: true,
        },
      },
    },
  })!;
  if (!user) {
    redirect(
      307,
      "/",
      { type: "error", message: "You need to be logged in for that." },
      cookies,
    );
  }

  let roles: Role[] = [];

  for (const facility of user.facilities) {
    if (facility.facilityId === inFacility) {
      roles = facility.roles;
      if (facility.assignmentType === "DivisionalStaff") {
        roles.push({
          id: ulid(),
          facilityId: inFacility,
          name: "__divisionStaff__",
          permissions: ["*"],
          color: "pink-500",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  }

  setUserRoles(roles);
  setUser(user);

  return {
    user,
    roles,
  };
}
