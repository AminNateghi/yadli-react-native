import { useEffect, useLayoutEffect, useState } from "react";
import { View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalStyles } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import {
  useCreateExpense,
  useGetExpense,
  useUpdateExpense,
} from "@/repositories/expense-repository";
import { type ExpenseFormData, expenseSchema } from "@/types/expense-schema";
import {
  type ExpenseDto,
  type ExpenseType,
  expenseTypeOptions,
} from "@/types/interfaces";
import { SelectPicker } from "@/components/SelectPicker";
import { DatePicker } from "@/components/DatePicker";
import { Input } from "@/components/Input";
import { ExpenseDeletionModal } from "@/components/forms/ExpenseDeletionModal";
import { Button } from "@/components/Button";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useStatistics } from "@/repositories/statistics";
import { numberFormat } from "@/utils/number-format";
import dayjs from "dayjs";
import { useActiveVehicle } from "@/repositories/active-vehicle";
import { SoldVehicleNotice } from "@/components/SoldVehicleNotice";
import { Toast } from "@/components/CustomToast";
import {
  ReminderSettings,
  parseReminderSettings,
  reminderSettingsToForm,
  type ReminderSettingsFormValues,
} from "@/components/forms/ReminderSettings";
import {
  useGetReminder,
  useGetReminderForExpense,
} from "@/repositories/reminder-repository";

const defaultValues = {
  type: "Reimbursement",
  date: dayjs().toISOString(),
  amount: undefined,
  odometer: undefined,
  note: "",
};

export default function ExpenseForm() {
  const params = useLocalSearchParams<{ id?: string; reminderId?: string }>();
  const [id] = useState<number>(Number(params.id));
  const reminderId = Number(params.reminderId) || null;
  const navigation = useNavigation();
  const isEditMode = !!id;

  const { t, isRTL } = useTranslation();
  const { data: activeVehicle } = useActiveVehicle();

  const { statistics } = useStatistics();

  const { mutate: updateService, isPending: isPendingUpdate } =
    useUpdateExpense(id);
  const { mutate: createService, isPending: isPendingCreate } =
    useCreateExpense();
  const { data } = useGetExpense(id);
  const { data: linkedReminder, isSuccess: linkedReminderLoaded } =
    useGetReminderForExpense(id || null);
  const { data: completingReminder, isSuccess: completingReminderLoaded } =
    useGetReminder(reminderId);
  const [reminderSettings, setReminderSettings] =
    useState<ReminderSettingsFormValues | null>(null);
  const [reminderSettingsTouched, setReminderSettingsTouched] = useState(false);
  const [reminderSettingsError, setReminderSettingsError] = useState<string>();

  const schema = expenseSchema(t);
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
  const selectedExpenseType = watch("type") as ExpenseType;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLargeTitle: true,
      headerTitleAlign: "center",
      title: isEditMode ? t("expenses.updateTitle") : t("expenses.createTitle"),
    });
  }, [navigation, t, isEditMode]);

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
      type: data.type,
      amount: data.amount,
      date: String(data.date),
      odometer: data.odometer,
      note: data.note,
    });
  }, [data, id, reset]);

  useEffect(() => {
    if (id && linkedReminderLoaded) {
      setReminderSettings(
        linkedReminder ? reminderSettingsToForm(linkedReminder) : null,
      );
      setReminderSettingsTouched(false);
    }
  }, [id, linkedReminder, linkedReminderLoaded]);

  useEffect(() => {
    if (!reminderId || !completingReminderLoaded) return;
    if (completingReminder?.expense) {
      reset({ ...defaultValues, type: completingReminder.expense.type });
      setReminderSettings(reminderSettingsToForm(completingReminder));
    }
    setReminderSettingsTouched(false);
  }, [completingReminder, completingReminderLoaded, reminderId, reset]);

  const handleResetForm = () => {
    reset(defaultValues);
  };

  const handleClose = () => {
    handleResetForm();
    router.back();
  };

  const handleSaveSuccess = () => {
    handleResetForm();
    if (reminderId !== null) {
      router.navigate("/reminders");
      return;
    }
    router.back();
  };

  const handleSave = async (formData: ExpenseFormData) => {
    const parsedReminder =
      reminderSettings !== null
        ? parseReminderSettings(reminderSettings, {
            expenseType: selectedExpenseType,
          })
        : null;
    if (
      reminderSettingsTouched &&
      reminderSettings !== null &&
      parsedReminder === null
    ) {
      setReminderSettingsError(t("common.required"));
      return;
    }
    setReminderSettingsError(undefined);
    const expense: Omit<ExpenseDto, "id" | "vehicleId"> = {
      type: formData.type as ExpenseType,
      date: new Date(formData.date),
      odometer: formData.odometer,
      amount: formData.amount,
      note: formData.note ?? null,
    };

    const callbacks = {
      onSuccess: (result: {
        notificationSyncFailed: boolean;
        notificationPermissionGranted: boolean;
      }) => {
        if (result.notificationSyncFailed) {
          Toast({ text: t("reminders.notificationError"), type: "warning" });
        } else if (!result.notificationPermissionGranted) {
          Toast({
            text: t("reminders.notificationPermissionDenied"),
            type: "warning",
          });
        }
        handleSaveSuccess();
      },
      onError: () =>
        Toast({ text: t("vehicles.recordSaveFailed"), type: "error" }),
    };

    const reminderOptions = {
      ...(reminderId !== null ? { reminderId } : {}),
      ...(id && reminderSettingsTouched && linkedReminder
        ? { reminderId: linkedReminder.id }
        : {}),
      ...(reminderSettingsTouched ? { reminder: parsedReminder } : {}),
    };

    if (id) updateService({ ...expense, ...reminderOptions }, callbacks);
    else createService({ ...expense, ...reminderOptions }, callbacks);
  };

  if (activeVehicle?.sold) {
    return <SoldVehicleNotice onClose={handleClose} />;
  }

  return (
    <KeyboardAwareScrollView
      style={[GlobalStyles.modalScroll, isRTL && { direction: "rtl" }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <Controller
        control={control}
        name="type"
        render={({ field: { value, onChange } }) => (
          <SelectPicker
            label={t("expenses.category")}
            value={value}
            options={expenseTypeOptions(t)}
            onValueChange={(value) => onChange(value as ExpenseType)}
          />
        )}
      />

      <Controller
        control={control}
        name="date"
        render={({ field: { value, onChange } }) => (
          <DatePicker
            label={t("expenses.date")}
            value={value}
            onChange={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="odometer"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label={t("expenses.odometer")}
            value={value?.toString() ?? ""}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType="numeric"
            placeholder={t("expenses.odometerPlaceholder")}
            style={{ direction: "ltr" }}
            error={errors?.odometer?.message}
            help={`${t("dashboard.latestOdometer")} ${numberFormat(statistics.distance.latestOdometer, { isRTL })}`}
          />
        )}
      />

      <Controller
        control={control}
        name="amount"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label={t("expenses.amount")}
            value={value?.toString() ?? ""}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType="decimal-pad"
            placeholder={t("expenses.amountPlaceholder")}
            style={{ direction: "ltr" }}
            error={errors?.amount?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="note"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label={t("expenses.notes")}
            value={value ?? ""}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder={t("expenses.notesPlaceholder")}
            multiline
            style={{
              height: 80,
              textAlignVertical: "top",
              paddingTop: 12,
            }}
          />
        )}
      />

      {(!id || linkedReminderLoaded) &&
        (reminderId === null || completingReminderLoaded) && (
          <ReminderSettings
            value={reminderSettings}
            expenseType={selectedExpenseType}
            onChange={(value) => {
              setReminderSettings(value);
              setReminderSettingsTouched(true);
              setReminderSettingsError(undefined);
            }}
            error={reminderSettingsError}
          />
        )}

      <View style={GlobalStyles.buttonColumn}>
        <Button
          title={id ? t("common.update") : t("common.save")}
          onPress={handleSubmit(handleSave)}
          loading={
            isPendingUpdate ||
            isPendingCreate ||
            (reminderId !== null && !completingReminderLoaded)
          }
          color="blue"
          style={{ flex: 1 }}
        />
        {isEditMode && (
          <ExpenseDeletionModal
            editingId={id}
            onConfirm={() => handleClose()}
          />
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}
