import { z } from "zod";
import type { NestedKeyOf, TranslationKeys } from "@/languages/TranslationKeys";

export const fuelSchema = (t: (key: NestedKeyOf<TranslationKeys>) => string) =>
  z.object({
    date: z.string().min(1, t("common.required")),
    odometer: z.number().positive(t("common.required")),
    liters: z.number().positive(t("common.required")),
    totalCost: z.number().positive(t("common.required")),
    fullTank: z.boolean().optional().default(false),
    station: z.string().nullable().optional(),
    pricePerLiter: z.number().positive(t("common.required")),
    note: z.string().nullable().optional(),
  });

export type FuelFormData = z.infer<ReturnType<typeof fuelSchema>>;
