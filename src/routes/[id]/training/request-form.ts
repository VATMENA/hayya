import { z } from "zod";

export const formSchema = z.object({
  trainingType: z.string(),
  dateStart: z.string().datetime(),
  dateEnd: z.string().datetime(),
  times: z.string()
});

export type FormSchema = typeof formSchema;