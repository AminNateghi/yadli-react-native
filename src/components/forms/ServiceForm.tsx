import { format } from "date-fns";
import { PlusIcon, XIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { useMediaQuery } from "react-responsive";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { globalStyles } from "@/constants/theme";
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
import {
  serviceSchema,
  type ServiceFormData,
} from "../../types/service-schema";
import { IconButton } from "../IconButton";

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

  const { mutate: updateService, isPending: isPendingUpdate } =
    useUpdateService(editingId!);
  const { mutate: doneService } = useDoneService();
  const { mutate: createService, isPending: isPendingCreate } =
    useCreateService();
  const { data } = useGetService(editingId);

  const schema = serviceSchema(t);
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
  const handleNew = () => {
    setModalVisible(true);
    handleResetForm();
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
          Toast({ text: t("common.saved") });
        },
      });
    } else {
      // first clear prev service warning
      doneService(formData.type as ServiceType);
      createService(service, {
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
            globalStyles.fabService,
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
                  ? t("services.updateTitle")
                  : t("services.createTitle")}
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
                      label={t("services.serviceType")}
                      value={value}
                      options={serviceTypeOptions(t)}
                      onValueChange={(value) => onChange(value as ServiceType)}
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
                      label={t("services.date")}
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
                      label={t("services.odometer")}
                      value={value?.toString() ?? ""}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text === "" ? undefined : Number(text));
                      }}
                      keyboardType="numeric"
                      placeholder={t("services.odometerPlaceholder")}
                      style={{ direction: "ltr" }}
                      error={errors?.odometer?.message}
                    />
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
                      error={errors?.cost?.message}
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
                  </>
                )}
              />

              <View style={globalStyles.modalButtonRow}>
                {editingId && (
                  <ServiceDeletionModal
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
