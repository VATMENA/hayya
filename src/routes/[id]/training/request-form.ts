import { z } from "zod";

export const formSchema = z.object({
  trainingType: z.string(),
  dateStart: z.date(),
  dateEnd: z.date(),
  times: z.string(),
});

export type FormSchema = typeof formSchema;
