import { z } from "zod";

export const formSchema = z.object({
  cid: z.string().min(1, { message: "You need to provide a CID" }),
  date: z.date(),
  sessionType: z
    .string()
    .min(1, { message: "You need to provide a session type" }),
  studentComments: z
    .string()
    .min(1, { message: "You must provide the student with feedback" }),
  mentorComments: z
    .string()
    .min(1, { message: "You must provide information to other mentors" }),
});

export type FormSchema = typeof formSchema;
