import { z } from "zod";
import type { NestedKeyOf, TranslationKeys } from "@/languages/TranslationKeys";

export const fuelSchema = (t: (key: NestedKeyOf<TranslationKeys>) => string) =>
  z.object({
    date: z
      .string({ error: t("common.required") })
      .min(1, { error: t("common.required") }),
    odometer: z.coerce.number(t("common.required")).positive(),
    liters: z.coerce.number(t("common.required")).positive(),
    pricePerLiter: z.coerce.number(t("common.required")).positive(),
    totalCost: z.coerce.number().optional(),
    fullTank: z.boolean().optional().default(false),
    station: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
  });

export type FuelFormData = z.infer<ReturnType<typeof fuelSchema>>;
