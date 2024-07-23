import { z } from "zod";

export const formSchema = z.object({
  userId: z.string(),
  eventId: z.string(),
  position: z.string(),
  // start: z.coerce.date(),
  // end: z.coerce.date(),
});

export type FormSchema = typeof formSchema;
