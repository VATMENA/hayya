import { z } from "zod";

export const formSchema = z.object({
  id: z.number(),
  studentComments: z
    .string()
    .min(1, { message: "You must provide the student with feedback" }),
  mentorComments: z
    .string()
    .min(1, { message: "You must provide information to other mentors" }),
});

export type FormSchema = typeof formSchema;
