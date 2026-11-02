import { z } from "zod";
import type { TranslationKey } from "@/languages/useTranslation";

export const vehicleSchema = (t: (key: TranslationKey) => string) =>
  z.object({
    customName: z.string().min(1, { error: t("common.required") }),
    makeModel: z.string().optional(),
    year: z.coerce.number().optional(),
    purchaseDate: z.string().optional(),
    purchasePrice: z.coerce.number().optional(),
    purchaseOdometer: z.coerce.number().optional(),
    fuelType: z.string().optional(),
    type: z.string().optional(),
    capacity: z.coerce.number().optional(),
  });

export type VehicleFormData = z.infer<ReturnType<typeof vehicleSchema>>;
