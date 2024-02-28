import { z } from "zod";

export const formSchema = z.object({
  id: z.string(),
  name: z.string(),
  dotnetId: z.string(),
  dotnetType: z.enum(["Subdivision", "Division"]),
});

export type FormSchema = typeof formSchema;
