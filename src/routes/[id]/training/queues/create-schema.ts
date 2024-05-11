import { z } from "zod";

export const createSchema = z.object({
  name: z.string(),
  description: z.string(),
  openRegistration: z.boolean(),
});

export type CreateSchema = typeof createSchema;
