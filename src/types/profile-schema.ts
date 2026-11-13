import { z } from "zod";
import type { TranslationKey } from "@/languages/useTranslation";

export const settingsSchema = (t: (key: TranslationKey) => string) =>
  z.object({
    distanceUnit: z.string().min(1, t("common.required")),
    fuelUnit: z.string().min(1, t("common.required")),
    currencySymbol: z.string().min(1, t("common.required")),
  });

export type SettingsFormData = z.infer<ReturnType<typeof settingsSchema>>;
