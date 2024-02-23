import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, { message: "You must provide a name" }),

  startDate: z.string().datetime({ offset: true }),
  startTime: z.coerce
    .number()
    .min(0, { message: "Time cannot be before 0000" })
    .max(2359, { message: "Time cannot be after 2359" }),
  endDate: z.string().datetime({ offset: true }),
  endTime: z.coerce
    .number()
    .min(0, { message: "Time cannot be before 0000" })
    .max(2359, { message: "Time cannot be after 2359" }),

  description: z.string().min(1, { message: "You must provide a description" }),

  bannerUrl: z.string().url(),
});

export type FormSchema = typeof formSchema;
