import { z } from "zod";
import type { NestedKeyOf, TranslationKeys } from "@/languages/TranslationKeys";

export const expenseSchema = (
  t: (key: NestedKeyOf<TranslationKeys>) => string,
) =>
  z.object({
    type: z.string().min(1, t("common.required")),
    date: z
      .string({ error: t("common.required") })
      .min(1, { error: t("common.required") }),
    odometer: z.number(t("common.required")).positive(),
    amount: z.coerce.number(t("common.required")).positive(),
    note: z.string().nullable().optional(),
  });

export type ExpenseFormData = z.infer<ReturnType<typeof expenseSchema>>;
