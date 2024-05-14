import { z } from "zod";

export const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  positions: z.string(),
  public: z.boolean(),
  allowSignups: z.boolean(),
});

export type FormSchema = typeof formSchema;
