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
  z
    .object({
      dependent: z.string({ error: t("common.required") }),
      serviceType: z.string().optional(),
      expenseType: z.string().optional(),

      mode: z.string(t("common.required")),
      triggerType: z.string(t("common.required")),
      active: z.boolean().optional().default(true),
      note: z.string().nullable().optional(),
      startOdometer: z.preprocess(
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

      startDate: z.string({ error: t("common.required") }).optional(),

      odometerInterval: z.preprocess(
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

      dateIntervalMonths: z.preprocess(
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
    .superRefine((data, ctx) => {
      if (data.dependent === "Service" && !data.serviceType) {
        ctx.addIssue({
          code: "custom",
          error: t("common.required"),
          message: t("common.required"),
          path: ["serviceType"],
        });
      }

      if (data.dependent === "Expense" && !data.expenseType) {
        ctx.addIssue({
          code: "custom",
          error: t("common.required"),
          message: t("common.required"),
          path: ["expenseType"],
        });
      }

      if (data.triggerType === "Odometer" || data.triggerType === "Either") {
        if (data.startOdometer === undefined) {
          ctx.addIssue({
            code: "custom",
            error: t("common.required"),
            message: t("common.required"),
            path: ["startOdometer"],
          });
        }

        if (data.odometerInterval === undefined) {
          ctx.addIssue({
            code: "custom",
            error: t("common.required"),
            message: t("common.required"),
            path: ["odometerInterval"],
          });
        }
      }

      // Validate date-related fields.
      if (data.triggerType === "Date" || data.triggerType === "Either") {
        if (!data.startDate) {
          ctx.addIssue({
            code: "custom",
            error: t("common.required"),
            message: t("common.required"),
            path: ["startDate"],
          });
        }

        if (data.dateIntervalMonths === undefined) {
          ctx.addIssue({
            code: "custom",
            error: t("common.required"),
            message: t("common.required"),
            path: ["dateIntervalMonths"],
          });
        }
      }
    });

export type ReminderFormData = z.infer<ReturnType<typeof reminderSchema>>;
