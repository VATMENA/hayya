import { z } from "zod";

export const formSchema = z.object({
  positions: z.string(),
});

export type FormSchema = typeof formSchema;
