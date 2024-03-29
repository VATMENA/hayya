import { z } from "zod";

export const formSchema = z.object({
  trainingType: z.string(),
  dateStart: z.string().datetime({ offset: true }),
  dateEnd: z.string().datetime({ offset: true }),
  times: z.string(),
});

export type FormSchema = typeof formSchema;
