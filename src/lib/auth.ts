import jwt from "jsonwebtoken";
import { JWT_HMAC_KEY } from "$env/static/private";
import type { Cookies } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import prisma from "$lib/prisma";
import { getUserRoles } from "$lib/perms/getUserRoles";
import type { Role, User } from "@prisma/client";

export function makeToken(cid: string): string {
  return jwt.sign({ cid: cid }, JWT_HMAC_KEY);
}

export function verifyToken(token: string): string | null {
  try {
    let decoded = jwt.verify(token, JWT_HMAC_KEY) as { cid: string };
    return decoded.cid;
  } catch {
    return null;
  }
}

export interface UserData {
  user: User;
  roles: Role[];
}

export async function loadUserData(cookies: Cookies): Promise<UserData> {
  if (!cookies.get("hq_token")) {
    redirect(
      307,
      "/",
      { type: "error", message: "You need to be logged in for that" },
      cookies,
    );
  }
  let token = cookies.get("hq_token")!;
  let maybe_cid = verifyToken(token);
  if (maybe_cid === null) {
    redirect(
      307,
      "/",
      { type: "error", message: "You need to be logged in for that" },
      cookies,
    );
  }
  let user = await prisma.user.findUnique({
    where: {
      id: maybe_cid,
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

  let user_roles = await getUserRoles(user.id);

  return {
    user,
    roles: user_roles!,
  };
}
