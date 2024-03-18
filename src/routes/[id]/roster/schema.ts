import { z } from "zod";
import { C_TYP, P_TYP, POS } from "$lib/cert";
import { setError } from "sveltekit-superforms/server";

export const formSchema = z
  .object({
    id: z.string(),
    c_typ: z.nativeEnum(C_TYP),
    p_typ: z.nativeEnum(P_TYP),
    facility: z.string().min(3).max(4).optional(),
    pos: z.nativeEnum(POS).optional(),
    comments: z.string(),
    solo_expires: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.c_typ === C_TYP.Solo && !data.solo_expires) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Expiry date must be provided for solo certificates",
        path: ["solo_expires"],
      });
    }
    if (data.c_typ === C_TYP.Permanent && data.solo_expires) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Permanent certificates cannot expire",
        path: ["solo_expires"],
      });
    }
    if (
      (data.p_typ === P_TYP.SuperCenter || data.p_typ === P_TYP.Enroute) &&
      data.pos
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "SuperCenter & Enroute certificates cannot specify a Position",
        path: ["pos"],
      });
    }
    if (
      (data.p_typ === P_TYP.SuperCenter || data.p_typ === P_TYP.Enroute) &&
      data.facility
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "SuperCenter & Enroute certificates cannot specify a Facility",
        path: ["facility"],
      });
    }
    if (
      (data.p_typ === P_TYP.OpenSkies || data.p_typ === P_TYP.Unrestricted) &&
      data.facility
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "OpenSkies & Unrestricted certificates cannot specify a Facility",
        path: ["facility"],
      });
    }
    if (
      (data.p_typ === P_TYP.OpenSkies || data.p_typ === P_TYP.Unrestricted) &&
      !data.pos
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "OpenSkies & Unrestricted certificates must specify a Position",
        path: ["pos"],
      });
    }
    if (
      (data.p_typ === P_TYP.Tier1 ||
        data.p_typ === P_TYP.Tier2 ||
        data.p_typ === P_TYP.Specific) &&
      !data.pos
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tier 1 & Tier 2 certificates must specify a Position",
        path: ["pos"],
      });
    }
    if (
      (data.p_typ === P_TYP.Tier1 ||
        data.p_typ === P_TYP.Tier2 ||
        data.p_typ === P_TYP.Specific) &&
      !data.facility
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tier 1 & Tier 2 certificates must specify a Facility",
        path: ["facility"],
      });
    }
  });
export type FormSchema = typeof formSchema;
