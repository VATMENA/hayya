import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  openRegistration: z.boolean(),
});

export type FormSchema = typeof formSchema;
