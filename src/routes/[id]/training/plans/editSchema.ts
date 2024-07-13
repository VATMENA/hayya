import { z } from "zod";

export const updateFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  policy: z.string(),
  includes: z.string().array(),
  excludes: z.string().array(),
  estimatedTime: z.string(),
  extraDetails: z.string(),
  hasAdjacentRestriction: z.boolean()
});

export type UpdateFormSchema = typeof updateFormSchema;