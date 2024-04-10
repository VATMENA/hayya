import { z } from "zod";

export const formSchema = z.object({
  id: z.string().min(1, {
    message: "Please enter the student's CID",
  }),
});

export type FormSchema = typeof formSchema;
