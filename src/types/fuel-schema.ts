import { z } from "zod";
import type { NestedKeyOf, TranslationKeys } from "@/languages/TranslationKeys";

export const fuelSchema = (t: (key: NestedKeyOf<TranslationKeys>) => string) =>
  z.object({
    date: z.string(t("common.required")).min(1),
    odometer: z.number(t("common.required")).positive(),
    liters: z.number(t("common.required")).positive(),
    pricePerLiter: z.number(t("common.required")),
    totalCost: z.number().optional(),
    fullTank: z.boolean().optional().default(false),
    station: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
  });

export type FuelFormData = z.infer<ReturnType<typeof fuelSchema>>;
