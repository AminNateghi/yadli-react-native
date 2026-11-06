import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { SelectPicker } from "@/components/SelectPicker";
import { SegmentedButtons } from "@/components/SegmentedButtons";
import { SwitchToggle } from "@/components/SwitchToggle";
import { useTranslation } from "@/languages/useTranslation";
import {
  type ExpenseType,
  type ReminderMode,
  type ServiceType,
  reminderDateIntervalMonths,
  reminderModeOptions,
  type ReminderSettingsDto,
  type ReminderTriggerType,
  reminderTriggerTypeOptions,
  serviceTypeOptions,
} from "@/types/interfaces";

export interface ReminderSettingsFormValues {
  serviceType?: ServiceType;
  expenseType?: ExpenseType;
  mode: ReminderMode;
  triggerType: ReminderTriggerType;
  odometerInterval: string;
  dateIntervalMonths: string;
  active: boolean;
  note: string;
}

export const defaultReminderSettings: ReminderSettingsFormValues = {
  mode: "Recurring",
  triggerType: "Either",
  odometerInterval: "5000",
  dateIntervalMonths: "6",
  active: true,
  note: "",
};

export function reminderSettingsToForm(
  settings: ReminderSettingsDto,
): ReminderSettingsFormValues {
  return {
    serviceType: settings.serviceType ?? undefined,
    expenseType: settings.expenseType ?? undefined,
    mode: settings.mode,
    triggerType: settings.triggerType,
    odometerInterval: String(settings.odometerInterval ?? ""),
    dateIntervalMonths: String(settings.dateIntervalMonths ?? ""),
    active: settings.active,
    note: settings.note ?? "",
  };
}

export function parseReminderSettings(
  values: ReminderSettingsFormValues,
  source: { serviceTypes?: ServiceType[]; expenseType?: ExpenseType } = {},
): ReminderSettingsDto | null {
  const odometerInterval = Number(values.odometerInterval);
  const dateIntervalMonths = Number(values.dateIntervalMonths);
  const needsOdometer =
    values.triggerType === "Odometer" || values.triggerType === "Either";
  const needsDate =
    values.triggerType === "Date" || values.triggerType === "Either";

  const serviceType =
    source.serviceTypes && values.serviceType
      ? source.serviceTypes.includes(values.serviceType)
        ? values.serviceType
        : source.serviceTypes[0]
      : values.serviceType;
  const expenseType = source.expenseType ?? values.expenseType;
  if ((!serviceType && !expenseType) || (serviceType && expenseType)) {
    return null;
  }

  if (
    (needsOdometer &&
      (!Number.isFinite(odometerInterval) || odometerInterval <= 0)) ||
    (needsDate &&
      (!Number.isFinite(dateIntervalMonths) || dateIntervalMonths <= 0))
  ) {
    return null;
  }

  return {
    serviceType: serviceType ?? null,
    expenseType: expenseType ?? null,
    mode: values.mode,
    triggerType: values.triggerType,
    odometerInterval: needsOdometer ? odometerInterval : null,
    dateIntervalMonths: needsDate ? dateIntervalMonths : null,
    active: values.active,
    note: values.note.trim() || null,
  };
}

interface ReminderSettingsProps {
  value: ReminderSettingsFormValues | null;
  onChange: (value: ReminderSettingsFormValues | null) => void;
  serviceTypes?: ServiceType[];
  expenseType?: ExpenseType;
  error?: string;
  showEnableToggle?: boolean;
}

export function ReminderSettings({
  value,
  onChange,
  serviceTypes,
  expenseType,
  error,
  showEnableToggle = true,
}: ReminderSettingsProps) {
  const { t } = useTranslation();
  const enabled = value !== null;
  const defaultSettings = {
    ...defaultReminderSettings,
    serviceType: serviceTypes?.[0],
    expenseType,
  };
  const settings = value ?? defaultSettings;

  const updateSettings = (updates: Partial<ReminderSettingsFormValues>) =>
    onChange({ ...settings, ...updates });

  return (
    <Card title={t("reminders.addWithRecord")}>
      {showEnableToggle && (
        <SwitchToggle
          label={t("reminders.enableForRecord")}
          value={enabled}
          onValueChange={(nextEnabled) => {
            onChange(
              nextEnabled
                ? {
                    ...settings,
                    serviceType: settings.serviceType ?? serviceTypes?.[0],
                    expenseType: settings.expenseType ?? expenseType,
                  }
                : null,
            );
          }}
        />
      )}
      {(enabled || !showEnableToggle) && (
        <>
          {serviceTypes && serviceTypes.length > 0 && (
            <SelectPicker
              label={t("services.serviceType")}
              value={settings.serviceType ?? ""}
              options={serviceTypeOptions(t).filter((option) =>
                serviceTypes.includes(option.value),
              )}
              onValueChange={(nextType) =>
                updateSettings({ serviceType: nextType as ServiceType })
              }
              error={error}
            />
          )}
          <SegmentedButtons
            label={t("reminders.mode")}
            buttons={reminderModeOptions(t)}
            value={settings.mode}
            onValueChange={(nextMode) =>
              updateSettings({ mode: nextMode as ReminderMode })
            }
          />
          <SegmentedButtons
            label={t("reminders.triggerType")}
            buttons={reminderTriggerTypeOptions(t)}
            value={settings.triggerType}
            onValueChange={(nextTrigger) =>
              updateSettings({
                triggerType: nextTrigger as ReminderTriggerType,
              })
            }
          />
          {(settings.triggerType === "Odometer" ||
            settings.triggerType === "Either") && (
            <Input
              label={t("reminders.odometerInterval")}
              value={settings.odometerInterval}
              onChangeText={(odometerInterval) =>
                updateSettings({ odometerInterval })
              }
              keyboardType="numeric"
              style={{ direction: "ltr" }}
              error={error}
            />
          )}
          {(settings.triggerType === "Date" ||
            settings.triggerType === "Either") && (
            <SelectPicker
              label={t("reminders.dateIntervalMonths")}
              value={settings.dateIntervalMonths}
              options={reminderDateIntervalMonths(t)}
              onValueChange={(dateIntervalMonths) =>
                updateSettings({ dateIntervalMonths })
              }
              error={error}
            />
          )}
          <Input
            label={t("reminders.notes")}
            value={settings.note}
            onChangeText={(note) => updateSettings({ note })}
            multiline
            style={{
              height: 80,
              textAlignVertical: "top",
              paddingTop: 12,
            }}
          />
          <SwitchToggle
            label={t("reminders.active")}
            value={settings.active}
            onValueChange={(active) => updateSettings({ active })}
          />
        </>
      )}
    </Card>
  );
}
