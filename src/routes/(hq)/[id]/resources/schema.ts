import { z } from "zod";

export const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string().url(),
  isPublic: z.boolean(),
});

export type FormSchema = typeof formSchema;
