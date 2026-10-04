import { format } from "date-fns";
import { PlusIcon, XIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useMediaQuery } from "react-responsive";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Colors, globalStyles } from "@/constants/theme";
import {
  useCreateService,
  useDoneService,
  useGetService,
  useUpdateService,
} from "@/contexts/service-repository";
import { useTranslation } from "@/languages/useTranslation";
import {
  type ServiceDto,
  type ServiceType,
  serviceTypeOptions,
} from "@/types/interfaces";
import { Button } from "../Button";
import { Toast } from "../CustomToast";
import { DatePicker } from "../DatePicker";
import { Input } from "../Input";
import { SelectPicker } from "../SelectPicker";
import { Text } from "../Text";
import { ServiceDeletionModal } from "./ServiceDeletionModal";
import { createServiceSchema, type ServiceFormData } from "./service-schema";

const defaultValues = {
  type: "EngineOil",
  date: format(new Date(), "yyyy-MM-dd"),
  odometer: undefined,
  cost: undefined,
  note: "",
  nextDueDate: null,
  nextDueOdometer: null,
};

type Props = {
  editingId: number | null;
  onClose: () => void;
};

export function ServiceForm({ editingId, onClose }: Props) {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const { t, isRTL } = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);

  const { mutate: updateService, isPending: isPendingUpdate } =
    useUpdateService(editingId!);
  const { mutate: doneService } = useDoneService();
  const { mutate: createService, isPending: isPendingCreate } =
    useCreateService();
  const { data } = useGetService(editingId);

  const schema = createServiceSchema(t);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues },
  });

  useEffect(() => {
    console.log("rest:", editingId);
    if (!editingId) {
      setModalVisible(false);
      reset(defaultValues);
      return;
    }

    setModalVisible(true);
  }, [editingId, reset]);

  useEffect(() => {
    console.log("edit:", editingId);
    console.log(data);
    if (!data || !editingId) {
      return;
    }

    reset({
      type: data.type,
      cost: data.cost,
      date: data.date,
      note: data.note,
      odometer: data.odometer,
      nextDueDate: data.nextDueDate,
      nextDueOdometer: data.nextDueOdometer,
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

  const handleDelete = async () => {
    if (!editingId) return;
    setIsConfirmDelete(true);
  };

  const handleSave = async (formData: ServiceFormData) => {
    const service: Omit<ServiceDto, "id"> = {
      type: formData.type as ServiceType,
      date: formData.date,
      odometer: formData.odometer,
      cost: formData.cost,
      note: formData.note ?? null,
      nextDueDate: formData.nextDueDate ?? null,
      nextDueOdometer: formData.nextDueOdometer ?? null,
      createdAt: null,
      updatedAt: null,
    };

    if (editingId) {
      updateService(service, {
        onSuccess: () => {
          Toast({ text: "Saved" });
        },
      });
    } else {
      // first clear prev service warning
      doneService(formData.type as ServiceType);
      createService(service, {
        onSuccess: () => {
          Toast({ text: "Saved" });
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
            pressed && globalStyles.fabPressed,
          ]}
          onPress={() => handleClose()}
        >
          <PlusIcon size={24} color="#FFFFFF" />
        </Pressable>
      </View>
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              isDesktop && styles.modalContentDesktop,
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId
                  ? t("services.updateTitle")
                  : t("services.createTitle")}
              </Text>
              <Pressable onPress={() => handleClose()}>
                <XIcon size={24} color={Colors.text} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <Controller
                control={control}
                name="type"
                render={({ field: { value, onChange } }) => (
                  <>
                    <SelectPicker
                      label={t("services.serviceType")}
                      value={value}
                      options={serviceTypeOptions(t)}
                      onValueChange={(value) => onChange(value as ServiceType)}
                    />

                    {errors.type && (
                      <Text style={globalStyles.error}>
                        {errors.type.message}
                      </Text>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="date"
                render={({ field: { value, onChange } }) => (
                  <>
                    <DatePicker
                      label={t("services.date")}
                      value={value}
                      onChange={onChange}
                    />

                    {errors.date && (
                      <Text style={globalStyles.error}>
                        {errors.date.message}
                      </Text>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="odometer"
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <Input
                      label={t("services.odometer")}
                      value={value?.toString() ?? ""}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text === "" ? undefined : Number(text));
                      }}
                      keyboardType="numeric"
                      placeholder={t("services.odometerPlaceholder")}
                      style={{ direction: "ltr" }}
                    />

                    {errors.odometer && (
                      <Text style={globalStyles.error}>
                        {errors.odometer.message}
                      </Text>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="cost"
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <Input
                      label={t("services.cost")}
                      value={value?.toString() ?? ""}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text === "" ? undefined : Number(text));
                      }}
                      keyboardType="decimal-pad"
                      placeholder={t("services.costPlaceholder")}
                      style={{ direction: "ltr" }}
                    />

                    {errors.cost && (
                      <Text style={globalStyles.error}>
                        {errors.cost.message}
                      </Text>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="note"
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <Input
                      label={t("services.note")}
                      value={value ?? ""}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder={t("services.notePlaceholder")}
                      multiline
                      style={{
                        height: 80,
                        textAlignVertical: "top",
                        paddingTop: 12,
                      }}
                    />

                    {errors.note && (
                      <Text style={globalStyles.error}>
                        {errors.note.message}
                      </Text>
                    )}
                  </>
                )}
              />

              <Text>{t("services.nextServiceDue")}</Text>

              <Controller
                control={control}
                name="nextDueDate"
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label={t("services.nextDueDate")}
                    value={value ?? ""}
                    onChange={onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="nextDueOdometer"
                render={({ field: { value, onChange } }) => (
                  <>
                    <Input
                      label={t("services.nextDueOdometer")}
                      value={value?.toString() ?? ""}
                      onChangeText={(text) => {
                        onChange(text === "" ? null : Number(text));
                      }}
                      keyboardType="numeric"
                      placeholder={t("services.nextDueOdometerPlaceholder")}
                      style={{ direction: "ltr" }}
                    />

                    {errors.nextDueOdometer && (
                      <Text style={globalStyles.error}>
                        {errors.nextDueOdometer.message}
                      </Text>
                    )}
                  </>
                )}
              />

              <View style={styles.buttonRow}>
                {editingId && (
                  <Button
                    title={t("common.delete")}
                    variant="danger"
                    onPress={handleDelete}
                    style={{ flex: 1 }}
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
      <ServiceDeletionModal editingId={editingId!} visible={isConfirmDelete} />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalContentDesktop: {
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
    borderRadius: 24,
    marginBottom: 40,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
  },
  modalScroll: {
    padding: 20,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
  },
});
