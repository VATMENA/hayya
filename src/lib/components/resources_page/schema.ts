import { z } from "zod";

export const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  link: z.string().url(),
  private: z.boolean(),
});

export type FormSchema = typeof formSchema;
