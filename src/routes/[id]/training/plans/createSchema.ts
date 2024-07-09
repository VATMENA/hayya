import { z } from "zod";

export const createFormSchema = z.object({
  name: z.string(),
  policy: z.string(),
  includes: z.string().array(),
  excludes: z.string().array(),
  estimatedTime: z.string(),
  extraDetails: z.string(),
  hasAdjacentRestriction: z.boolean()
});

export type CreateFormSchema = typeof createFormSchema;