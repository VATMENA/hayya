import { z } from "zod";

export const formSchema = z.object({
  requestId: z.string(),
  instructorId: z.string()
});

export type FormSchema = typeof formSchema;