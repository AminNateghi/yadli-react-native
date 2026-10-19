import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { globalStyles } from "@/constants/theme";
import { useTranslation } from "@/languages/useTranslation";
import {
  useCreateReminder,
  useGetReminder,
  useUpdateReminder,
} from "@/repositories/reminder-repository";
import { type ReminderFormData, reminderSchema } from "@/types/reminder-schema";
import {
  type ExpenseType,
  expenseTypeOptions,
  reminderDateIntervalMonths,
  type ReminderDependent,
  reminderDependentOptions,
  type ReminderDto,
  type ReminderMode,
  reminderModeOptions,
  type ReminderTriggerType,
  reminderTriggerTypeOptions,
  type ServiceType,
  serviceTypeOptions,
} from "@/types/interfaces";
import { router, useLocalSearchParams } from "expo-router";
import { Card } from "@/components/Card";
import { SelectPicker } from "@/components/SelectPicker";
import { SegmentedButtons } from "@/components/SegmentedButtons";
import { DatePicker } from "@/components/DatePicker";
import { Input } from "@/components/Input";
import { SwitchToggle } from "@/components/SwitchToggle";
import { CompleteReminderModal } from "@/components/forms/CompleteReminderModal";
import { ReminderDeletionModal } from "@/components/forms/ReminderDeletionModal";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const defaultValues = {
  dependent: "Service",
  mode: "OneTime",
  note: undefined,
  serviceType: undefined,
  expenseType: undefined,
  triggerType: "Either",
  startOdometer: undefined,
  startDate: undefined,
  odometerInterval: undefined,
  dateIntervalMonths: undefined,
  nextOdometer: undefined,
  nextDate: undefined,
  active: true,
};

export default function ReminderForm() {
  const params = useLocalSearchParams<{ id: string }>();
  const [id] = useState<number>(Number(params.id));
  const [isEditMode] = useState<boolean>(Number(params.id) > 0);
  const { t, isRTL } = useTranslation();

  const { mutate: updateService, isPending: isPendingUpdate } =
    useUpdateReminder(id!);
  const { mutate: createService, isPending: isPendingCreate } =
    useCreateReminder();
  const { data } = useGetReminder(id);

  const schema = reminderSchema(t);
  const {
    watch,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues },
  });

  useEffect(() => {
    if (!id) {
      reset(defaultValues);
      return;
    }
  }, [id, reset]);

  useEffect(() => {
    if (!data || !id) {
      return;
    }

    reset({
      dependent: data.serviceType ? "Service" : "Expense",
      mode: data.mode,
      note: data.note,
      serviceType: data.serviceType ?? undefined,
      expenseType: data.expenseType ?? undefined,
      triggerType: data.triggerType,
      startOdometer: data.startOdometer ?? undefined,
      startDate: String(data.startDate) ?? undefined,
      odometerInterval: data.odometerInterval ?? undefined,
      dateIntervalMonths: data.dateIntervalMonths ?? undefined,
      active: data.active,
    });
  }, [data, id, reset]);

  const handleResetForm = () => {
    reset(defaultValues);
  };

  const handleClose = () => {
    handleResetForm();
    router.back();
  };

  const handleSave = async (formData: ReminderFormData) => {
    const reminder: Omit<ReminderDto, "id"> = {
      mode: formData.mode as ReminderMode,
      note: formData.note ?? null,
      serviceType:
        formData.dependent === "Service"
          ? (formData.serviceType! as ServiceType)
          : null,
      expenseType:
        formData.dependent === "Expense"
          ? (formData.expenseType! as ExpenseType)
          : null,
      triggerType: formData.triggerType as ReminderTriggerType,
      startOdometer: formData.startOdometer ?? null,
      startDate: formData.startDate ? new Date(formData.startDate) : null,
      odometerInterval: formData.odometerInterval ?? null,
      dateIntervalMonths: formData.dateIntervalMonths ?? null,
      active: formData.active,
    };

    if (id) {
      updateService(reminder);
    } else {
      createService(reminder);
    }

    handleClose();
    handleResetForm();
  };

  const dependent = watch("dependent") as ReminderDependent;
  const trigger = watch("triggerType") as ReminderTriggerType;

  return (
    <KeyboardAwareScrollView
      style={[globalStyles.modalScroll, isRTL && { direction: "rtl" }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <Card title={t("reminders.titleCard1")}>
        <Controller
          control={control}
          name="dependent"
          render={({ field: { value, onChange } }) => (
            <SelectPicker
              label={t("reminders.dependent")}
              value={value}
              options={reminderDependentOptions(t)}
              onValueChange={(value) => onChange(value)}
            />
          )}
        />

        {dependent === "Service" && (
          <Controller
            control={control}
            name="serviceType"
            render={({ field: { value, onChange } }) => (
              <SelectPicker
                label={t("services.serviceType")}
                value={value ?? ""}
                options={serviceTypeOptions(t)}
                onValueChange={(value) => onChange(value as ServiceType)}
                error={errors.serviceType?.message}
              />
            )}
          />
        )}

        {dependent === "Expense" && (
          <Controller
            control={control}
            name="expenseType"
            render={({ field: { value, onChange } }) => (
              <SelectPicker
                label={t("expenses.category")}
                value={value ?? ""}
                options={expenseTypeOptions(t)}
                onValueChange={(value) => onChange(value as ExpenseType)}
                error={errors.expenseType?.message}
              />
            )}
          />
        )}
      </Card>

      <Card title={t("reminders.mode")}>
        <Controller
          control={control}
          name="mode"
          render={({ field: { value, onChange } }) => (
            <SegmentedButtons
              buttons={reminderModeOptions(t)}
              value={value}
              onValueChange={(value) => onChange(value)}
            />
          )}
        />
      </Card>

      <Card title={t("reminders.titleCard3")}>
        <Controller
          control={control}
          name="triggerType"
          render={({ field: { value, onChange } }) => (
            <SegmentedButtons
              label={t("reminders.triggerType")}
              buttons={reminderTriggerTypeOptions(t)}
              value={value}
              onValueChange={(value) => onChange(value)}
            />
          )}
        />

        {trigger === "Date" && (
          <>
            <Controller
              control={control}
              name="dateIntervalMonths"
              render={({ field: { value, onChange } }) => (
                <SelectPicker
                  label={t("reminders.dateIntervalMonths")}
                  value={String(value)}
                  options={reminderDateIntervalMonths(t)}
                  onValueChange={(value) => onChange(Number(value))}
                  error={errors.dateIntervalMonths?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="startDate"
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  label={t("reminders.startDate")}
                  value={value ?? ""}
                  onChange={onChange}
                  error={errors.startDate?.message}
                />
              )}
            />
          </>
        )}
        {trigger === "Odometer" && (
          <>
            <Controller
              control={control}
              name="odometerInterval"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label={t("reminders.odometerInterval")}
                  value={value?.toString() ?? ""}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  style={{ direction: "ltr" }}
                  error={errors.odometerInterval?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="startOdometer"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label={t("reminders.startOdometer")}
                  value={value?.toString() ?? ""}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  style={{ direction: "ltr" }}
                  error={errors.startOdometer?.message}
                />
              )}
            />
          </>
        )}

        {trigger === "Either" && (
          <>
            <Controller
              control={control}
              name="dateIntervalMonths"
              render={({ field: { value, onChange } }) => (
                <SelectPicker
                  label={t("reminders.dateIntervalMonths")}
                  value={String(value)}
                  options={reminderDateIntervalMonths(t)}
                  onValueChange={(value) => onChange(Number(value))}
                  error={errors.dateIntervalMonths?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="odometerInterval"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label={t("reminders.odometerInterval")}
                  value={value?.toString() ?? ""}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  style={{ direction: "ltr" }}
                  error={errors.odometerInterval?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="startDate"
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  label={t("reminders.startDate")}
                  value={value ?? ""}
                  onChange={onChange}
                  error={errors.startDate?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="startOdometer"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label={t("reminders.startOdometer")}
                  value={value?.toString() ?? ""}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  style={{ direction: "ltr" }}
                  error={errors.startOdometer?.message}
                />
              )}
            />
          </>
        )}
      </Card>

      {isEditMode && (
        <Controller
          control={control}
          name="active"
          render={({ field: { value, onChange } }) => (
            <SwitchToggle
              label={t("reminders.active")}
              value={value ?? false}
              onValueChange={(value) => onChange(value)}
            />
          )}
        />
      )}

      <Controller
        control={control}
        name="note"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label={t("reminders.notes")}
            value={value ?? ""}
            onBlur={onBlur}
            onChangeText={onChange}
            multiline
            style={{
              height: 80,
              textAlignVertical: "top",
              paddingTop: 12,
            }}
          />
        )}
      />

      <View style={globalStyles.buttonColumn}>
        <Button
          title={id ? t("common.update") : t("common.save")}
          onPress={handleSubmit(handleSave)}
          loading={isPendingUpdate || isPendingCreate}
          style={{ flex: 1 }}
        />
        {isEditMode && (
          <View style={globalStyles.buttonRow}>
            <CompleteReminderModal id={id} onConfirm={() => handleClose()} />
            <ReminderDeletionModal
              editingId={id!}
              onConfirm={() => handleClose()}
            />
          </View>
        )}
      </View>

      <View style={{ height: 40 }} />
    </KeyboardAwareScrollView>
  );
}
