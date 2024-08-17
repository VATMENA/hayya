import { z } from "zod";
import { getLocalTimeZone, today } from "@internationalized/date";

export const upgradeSchema = z.object({
  requestId: z.string(),
  sessionDate: z.object({
    date: z.string().date().default(today(getLocalTimeZone()).toString()),
    time: z.object({
      hour: z.coerce.number().min(0).max(23),
      minute: z.coerce.number().min(0).max(59),
    }),
  }),
  scoresheetUrl: z.string().url().optional(),
});

export type UpgradeSchema = typeof upgradeSchema;
