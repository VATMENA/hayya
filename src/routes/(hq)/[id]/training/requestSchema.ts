import { z } from "zod";

export const requestSchema = z.object({
  availability: z.object({
    date: z.string().date(),
    start: z.object({
      hour: z.number().min(0).max(23),
      minute: z.number().min(0).max(59)
    }),
    end: z.object({
      hour: z.number().min(0).max(23),
      minute: z.number().min(0).max(59)
    })
  }).array(),
  notes: z.string()
});

export type RequestSchema = typeof requestSchema;