import type { Role, User } from "@prisma/client";

export let userRoles: Role[] | null = null;
export let user: User | null = null;

export function setUserRoles(roles: Role[]) {
  userRoles = roles;
}
export function setUser(user_: User) {
  user = user_;
}
