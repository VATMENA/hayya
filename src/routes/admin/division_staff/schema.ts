import { z } from "zod";

export const formSchema = z.object({
  cid: z.string(),
  facilityId: z.string(),
});

export const formSchema2 = z.object({
  cid: z.string()
})

export type FormSchema = typeof formSchema;
export type FormSchema2 = typeof formSchema2;
