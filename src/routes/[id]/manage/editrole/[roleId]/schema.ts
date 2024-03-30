import { z } from "zod";
import { PERMISSIONS } from "$lib/perms/permissions";

const baseSchema = {
  name: z.string(),
  color: z.string(),
};

for (const permission of PERMISSIONS) {
  // @ts-ignore
  baseSchema[permission.id] = z.preprocess((x) => String(x) === "on", z.any());
}

export const formSchema = z.object(baseSchema);

export type FormSchema = typeof formSchema;
