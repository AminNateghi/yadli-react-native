import { z } from "zod";
import type { TranslationKey } from "@/languages/useTranslation";

export const vehicleSchema = (t: (key: TranslationKey) => string) =>
  z
    .object({
      customName: z.string().min(1, { error: t("common.required") }),
      makeModel: z.string().optional(),
      year: z.coerce.number().optional(),
      purchaseDate: z.string().optional(),
      purchasePrice: z.coerce.number().optional(),
      purchaseOdometer: z.coerce.number().optional(),
      sold: z.boolean(),
      soldDate: z.string().nullable().optional(),
      soldPrice: z.preprocess(
        (value) => (value === "" || value == null ? undefined : value),
        z.coerce.number().nonnegative().optional(),
      ),
      soldOdometer: z.preprocess(
        (value) => (value === "" || value == null ? undefined : value),
        z.coerce.number().nonnegative().optional(),
      ),
      fuelType: z.string().optional(),
      type: z.string().optional(),
      capacity: z.coerce.number().optional(),
    })
    .superRefine((vehicle, context) => {
      if (!vehicle.sold) return;

      if (!vehicle.soldDate) {
        context.addIssue({
          code: "custom",
          message: t("common.required"),
          path: ["soldDate"],
        });
      }
      if (vehicle.soldPrice === undefined) {
        context.addIssue({
          code: "custom",
          message: t("common.required"),
          path: ["soldPrice"],
        });
      }
      if (vehicle.soldOdometer === undefined) {
        context.addIssue({
          code: "custom",
          message: t("common.required"),
          path: ["soldOdometer"],
        });
      }
    });

export type VehicleFormData = z.infer<ReturnType<typeof vehicleSchema>>;
