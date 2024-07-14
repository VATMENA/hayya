import { z } from "zod";

export const formSchema = z.object({
  facilityId: z.string(),

  // qs
  why: z.string(),
  whatPositions: z.string(),
  experience: z.string(),
  anythingElse: z.string(),
});

export type FormSchema = typeof formSchema;
