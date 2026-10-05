import { z } from "zod";
import type { NestedKeyOf, TranslationKeys } from "@/languages/TranslationKeys";

export const serviceSchema = (
  t: (key: NestedKeyOf<TranslationKeys>) => string,
) =>
  z.object({
    type: z.string().min(1, t("common.required")),
    date: z.string().min(1, t("common.required")),
    odometer: z.number(t("common.required")).positive(),
    cost: z.number(t("common.required")).positive(),
    note: z.string().nullable().optional(),
    nextDueDate: z.string().nullable().optional(),
    nextDueOdometer: z.number().nullable().optional(),
  });

export type ServiceFormData = z.infer<ReturnType<typeof serviceSchema>>;
