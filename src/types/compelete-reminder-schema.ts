import { z } from "zod";
import type { NestedKeyOf, TranslationKeys } from "@/languages/TranslationKeys";

export const completeReminderSchema = (
  t: (key: NestedKeyOf<TranslationKeys>) => string,
) =>
  z
    .object({
      date: z.string({ error: t("common.required") }).optional(),
      odometer: z.preprocess(
        (value) =>
          value === "" || value === null || value === undefined
            ? undefined
            : typeof value === "string"
              ? Number(value)
              : value,
        z
          .number({ error: t("common.required") })
          .positive()
          .optional(),
      ),
    })
    .refine(
      (data) => !!data.date?.trim() || !!data.odometer?.toString().trim(),
      { error: t("common.required"), path: ["odometer"] },
    );

export type CompleteReminderFormData = z.infer<
  ReturnType<typeof completeReminderSchema>
>;
