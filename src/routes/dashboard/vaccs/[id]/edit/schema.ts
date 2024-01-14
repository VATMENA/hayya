import { z } from "zod";

export const formSchema = z.object({
  name: z.string(),
  website: z.string(),
  contact_email: z.string(),
});

export type FormSchema = typeof formSchema;
