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
import { IconButton } from "../IconButton";
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
import { ReminderDeletionModal } from "./ReminderDeletionModal";
import { SwitchToggle } from "../SwitchToggle";
import { Card } from "../Card";
import { CompleteReminderModal } from "./CompleteReminderModal";
import { SegmentedButtons } from "../SegmentedButtons";

const modeOptions = [
  { label: "Map", value: "map" },
  { label: "Transit", value: "transit" },
  { label: "Satellite", value: "satellite" },
];

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

type Props = {
  editingId: number | null;
  onClose: () => void;
};

export function ReminderForm({ editingId, onClose }: Props) {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const { t, isRTL } = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { mutate: updateService, isPending: isPendingUpdate } =
    useUpdateReminder(editingId!);
  const { mutate: createService, isPending: isPendingCreate } =
    useCreateReminder();
  const { data } = useGetReminder(editingId);

  const schema = reminderSchema(t);
  const {
    watch,
    control,
    reset,
    handleSubmit,
    formState: { isValid },
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

    if (editingId) {
      updateService(reminder, {
        onSuccess: () => {
          Toast({ text: t("common.saved") });
        },
      });
    } else {
      createService(reminder, {
        onSuccess: () => {
          Toast({ text: t("common.saved") });
        },
      });
    }

    handleClose();
    handleResetForm();
  };

  const dependent = watch("dependent") as ReminderDependent;
  const mode = watch("mode") as ReminderMode;
  const trigger = watch("triggerType") as ReminderTriggerType;

  const [singleValue, setSingleValue] = useState<string>("map");

  // Multi Select State
  const [multiValues, setMultiValues] = useState<string[]>(["map"]);
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
            globalStyles.fabReminder,
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
                  ? t("reminders.updateTitle")
                  : t("reminders.createTitle")}
              </Text>
              <IconButton icon={XIcon} onPress={() => handleClose()} />
            </View>

            <ScrollView
              style={globalStyles.modalScroll}
              showsVerticalScrollIndicator={false}
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
                        onValueChange={(value) =>
                          onChange(value as ServiceType)
                        }
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
                        onValueChange={(value) =>
                          onChange(value as ExpenseType)
                        }
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
                          onChangeText={(text) => {
                            onChange(text === "" ? undefined : Number(text));
                          }}
                          keyboardType="numeric"
                          style={{ direction: "ltr" }}
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
                          onChangeText={(text) => {
                            onChange(text === "" ? undefined : Number(text));
                          }}
                          keyboardType="numeric"
                          style={{ direction: "ltr" }}
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
                          onChangeText={(text) => {
                            onChange(text === "" ? undefined : Number(text));
                          }}
                          keyboardType="numeric"
                          style={{ direction: "ltr" }}
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
                          onChangeText={(text) => {
                            onChange(text === "" ? undefined : Number(text));
                          }}
                          keyboardType="numeric"
                          style={{ direction: "ltr" }}
                        />
                      )}
                    />
                  </>
                )}
              </Card>

              {editingId && (
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

              {editingId && (
                <CompleteReminderModal id={editingId} onConfirm={() => {}} />
              )}
              <View style={globalStyles.modalButtonRow}>
                {editingId && (
                  <ReminderDeletionModal
                    editingId={editingId!}
                    onConfirm={() => handleClose()}
                  />
                )}
                <Button
                  title={editingId ? t("common.update") : t("common.save")}
                  onPress={handleSubmit(handleSave)}
                  loading={isPendingUpdate || isPendingCreate}
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
