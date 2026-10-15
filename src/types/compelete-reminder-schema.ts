import { z } from "zod";
import type { NestedKeyOf, TranslationKeys } from "@/languages/TranslationKeys";

export const completeReminderSchema = (
  t: (key: NestedKeyOf<TranslationKeys>) => string,
) =>
  z.object({
    date: z.string().min(1, t("common.required")),
    odometer: z.number(t("common.required")).positive(),
  });

export type CompleteReminderFormData = z.infer<
  ReturnType<typeof completeReminderSchema>
>;
