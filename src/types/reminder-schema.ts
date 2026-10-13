import { z } from "zod";
import type { NestedKeyOf, TranslationKeys } from "@/languages/TranslationKeys";

// "dependent": There are two types: Service and Expense.
// The user selects one, and the corresponding field—either `serviceType` or `expenseType`—becomes active.
// The user then fills in the selected field.

// mode: There are two types: One-time and recurring
// triggerType: There are three types: Odometer, Date, Either

export const reminderSchema = (
  t: (key: NestedKeyOf<TranslationKeys>) => string,
) =>
  z.object({
    dependent: z.string(),
    serviceType: z.string().optional(),
    expenseType: z.string().optional(),

    mode: z.string(t("common.required")),
    triggerType: z.string(t("common.required")),
    startOdometer: z.number().optional(),
    startDate: z.string().optional(),
    odometerInterval: z.number().optional(),
    dateIntervalMonths: z.number().optional(),
    active: z.boolean().optional().default(true),
    note: z.string().nullable().optional(),
  });

export type ReminderFormData = z.infer<ReturnType<typeof reminderSchema>>;
