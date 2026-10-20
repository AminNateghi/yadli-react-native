import { z } from "zod";
import type { TranslationKey } from "@/languages/useTranslation";

export const serviceSchema = (t: (key: TranslationKey) => string) =>
  z.object({
    type: z.string().min(1, t("common.required")),
    date: z
      .string({ error: t("common.required") })
      .min(1, { error: t("common.required") }),
    odometer: z.coerce.number({ error: t("common.required") }).positive(),
    cost: z.coerce.number(t("common.required")).positive(),
    note: z.string().nullable().optional(),
  });

export type ServiceFormData = z.infer<ReturnType<typeof serviceSchema>>;
