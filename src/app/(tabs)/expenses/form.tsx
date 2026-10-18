import { format } from "date-fns";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { globalStyles } from "@/constants/theme";
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
import { router, useLocalSearchParams } from "expo-router";

const defaultValues = {
  type: "Reimbursement",
  date: format(new Date(), "yyyy-MM-dd"),
  amount: undefined,
  odometer: undefined,
  note: "",
};

export default function ExpenseForm() {
  const params = useLocalSearchParams<{ id: string }>();
  const [id] = useState<number>(Number(params.id));
  const [isEditMode] = useState<boolean>(Number(params.id) > 0);
  const { t, isRTL } = useTranslation();

  const { mutate: updateService, isPending: isPendingUpdate } =
    useUpdateExpense(id!);
  const { mutate: createService, isPending: isPendingCreate } =
    useCreateExpense();
  const { data } = useGetExpense(id);

  const schema = expenseSchema(t);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid },
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
      type: data.type,
      amount: data.amount,
      date: String(data.date),
      odometer: data.odometer,
      note: data.note,
    });
  }, [data, id, reset]);

  const handleResetForm = () => {
    reset(defaultValues);
  };

  const handleClose = () => {
    handleResetForm();
    router.back();
  };

  const handleSave = async (formData: ExpenseFormData) => {
    const expense: Omit<ExpenseDto, "id"> = {
      type: formData.type as ExpenseType,
      date: new Date(formData.date),
      odometer: formData.odometer,
      amount: formData.amount,
      note: formData.note ?? null,
    };

    if (id) {
      updateService(expense);
    } else {
      createService(expense);
    }

    handleClose();
    handleResetForm();
  };

  return (
    <ScrollView
      style={[globalStyles.modalScroll, isRTL && { direction: "rtl" }]}
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
            onChangeText={(text) => {
              onChange(text === "" ? undefined : Number(text));
            }}
            keyboardType="numeric"
            placeholder={t("expenses.odometerPlaceholder")}
            style={{ direction: "ltr" }}
            error={errors?.odometer?.message}
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
            onChangeText={(text) => {
              onChange(text === "" ? undefined : Number(text));
            }}
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

      <View style={globalStyles.buttonColumn}>
        <Button
          title={id ? t("common.update") : t("common.save")}
          onPress={handleSubmit(handleSave)}
          loading={isPendingUpdate || isPendingCreate}
          disabled={!isValid}
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
    </ScrollView>
  );
}
