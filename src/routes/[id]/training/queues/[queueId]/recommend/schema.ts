import { z } from "zod";

export const formSchema = z.object({
  cid: z.string().min(1),
});

export type FormSchema = typeof formSchema;
