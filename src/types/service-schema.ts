import { z } from "zod";
import type { NestedKeyOf, TranslationKeys } from "@/languages/TranslationKeys";

export const createServiceSchema = (
  t: (key: NestedKeyOf<TranslationKeys>) => string,
) =>
  z.object({
    type: z.string().min(1, t("common.required")),
    date: z.string().min(1, t("common.required")),
    odometer: z.number().positive(t("common.required")),
    cost: z.number().positive(t("common.required")),
    note: z.string().nullable().optional(),
    nextDueDate: z.string().nullable().optional(),
    nextDueOdometer: z.number().nullable().optional(),
  });

export type ServiceFormData = z.infer<ReturnType<typeof createServiceSchema>>;
