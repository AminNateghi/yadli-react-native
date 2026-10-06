import { format } from "date-fns";
import { PlusIcon, XIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { useMediaQuery } from "react-responsive";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { globalStyles } from "@/constants/theme";
import { useTranslation } from "@/languages/useTranslation";
import { Button } from "../Button";
import { Toast } from "../CustomToast";
import { DatePicker } from "../DatePicker";
import { Input } from "../Input";
import { SelectPicker } from "../SelectPicker";
import { Text } from "../Text";
import {
  useCreateExpense,
  useGetExpense,
  useUpdateExpense,
} from "@/contexts/expense-repository";
import { type ExpenseFormData, expenseSchema } from "@/types/expense-schema";
import {
  type ExpenseDto,
  type ExpenseType,
  expenseTypeOptions,
} from "@/types/interfaces";
import { ExpenseDeletionModal } from "./ExpenseDeletionModal";
import { IconButton } from "../IconButton";

const defaultValues = {
  type: "Reimbursement",
  date: format(new Date(), "yyyy-MM-dd"),
  amount: undefined,
  odometer: undefined,
  note: "",
};

type Props = {
  editingId: number | null;
  onClose: () => void;
};

export function ExpenseForm({ editingId, onClose }: Props) {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const { t, isRTL } = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { mutate: updateService, isPending: isPendingUpdate } =
    useUpdateExpense(editingId!);
  const { mutate: createService, isPending: isPendingCreate } =
    useCreateExpense();
  const { data } = useGetExpense(editingId);

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
    if (!editingId) {
      setModalVisible(false);
      reset(defaultValues);
      return;
    }

    setModalVisible(true);
  }, [editingId, reset]);

  useEffect(() => {
    if (!data || !editingId) {
      return;
    }

    reset({
      type: data.type,
      amount: data.amount,
      date: data.date,
      odometer: data.odometer,
      note: data.note,
    });
  }, [data, editingId, reset]);

  const handleResetForm = () => {
    reset(defaultValues);
  };

  const handleClose = () => {
    setModalVisible(false);
    handleResetForm();
    onClose();
  };
  const handleNew = () => {
    setModalVisible(true);
    handleResetForm();
  };

  const handleSave = async (formData: ExpenseFormData) => {
    const expense: Omit<ExpenseDto, "id"> = {
      type: formData.type as ExpenseType,
      date: formData.date,
      odometer: formData.odometer,
      amount: formData.amount,
      note: formData.note ?? null,
      createdAt: null,
      updatedAt: null,
    };

    if (editingId) {
      updateService(expense, {
        onSuccess: () => {
          Toast({ text: t("common.saved") });
        },
      });
    } else {
      createService(expense, {
        onSuccess: () => {
          Toast({ text: t("common.saved") });
        },
      });
    }

    handleClose();
    handleResetForm();
  };

  return (
    <>
      <View
        style={[
          isRTL ? globalStyles.fabContainerRTL : globalStyles.fabContainer,
          isDesktop && globalStyles.fabContainerDesktop,
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            globalStyles.fab,
            globalStyles.fabExpense,
            pressed && globalStyles.fabPressed,
          ]}
          onPress={() => handleNew()}
        >
          <PlusIcon size={24} color="#FFFFFF" />
        </Pressable>
      </View>
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={globalStyles.modalOverlay}>
          <View
            style={[
              globalStyles.modalContent,
              isDesktop && globalStyles.modalContentDesktop,
            ]}
          >
            <View style={globalStyles.modalHeader}>
              <Text style={globalStyles.modalTitle}>
                {editingId
                  ? t("expenses.updateTitle")
                  : t("expenses.createTitle")}
              </Text>
              <IconButton icon={XIcon} onPress={() => handleClose()} />
            </View>

            <ScrollView
              style={globalStyles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <Controller
                control={control}
                name="type"
                render={({ field: { value, onChange } }) => (
                  <>
                    <SelectPicker
                      label={t("expenses.category")}
                      value={value}
                      options={expenseTypeOptions(t)}
                      onValueChange={(value) => onChange(value as ExpenseType)}
                    />
                  </>
                )}
              />

              <Controller
                control={control}
                name="date"
                render={({ field: { value, onChange } }) => (
                  <>
                    <DatePicker
                      label={t("expenses.date")}
                      value={value}
                      onChange={onChange}
                    />
                  </>
                )}
              />

              <Controller
                control={control}
                name="odometer"
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
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
                  </>
                )}
              />

              <Controller
                control={control}
                name="amount"
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
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
                  </>
                )}
              />

              <Controller
                control={control}
                name="note"
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
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
                  </>
                )}
              />

              <View style={globalStyles.modalButtonRow}>
                {editingId && (
                  <ExpenseDeletionModal
                    editingId={editingId!}
                    onConfirm={() => handleClose()}
                  />
                )}
                <Button
                  title={editingId ? t("common.update") : t("common.save")}
                  onPress={handleSubmit(handleSave)}
                  loading={isPendingUpdate || isPendingCreate}
                  disabled={!isValid}
                  style={{ flex: 1 }}
                />
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
