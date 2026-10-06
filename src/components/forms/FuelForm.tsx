import { format } from "date-fns";
import { PlusIcon, XIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useMediaQuery } from "react-responsive";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Colors, globalStyles } from "@/constants/theme";
import { useTranslation } from "@/languages/useTranslation";
import { Button } from "../Button";
import { Toast } from "../CustomToast";
import { DatePicker } from "../DatePicker";
import { Input } from "../Input";
import { Text } from "../Text";
import { type FuelFormData, fuelSchema } from "@/types/fuel-schema";
import {
  useCreateFuel,
  useGetFuel,
  useUpdateFuel,
} from "@/contexts/fuel-repository";
import type { FuelDto } from "@/types/interfaces";
import { PriceValue } from "../PriceValue";
import { SwitchToggle } from "../SwitchToggle";
import { FuelDeletionModal } from "./FuelDeletionModal";
import { IconButton } from "../IconButton";

const defaultValues = {
  date: format(new Date(), "yyyy-MM-dd"),
  fullTank: false,
  liters: undefined,
  odometer: undefined,
  pricePerLiter: undefined,
  totalCost: undefined,
  note: "",
  station: "",
};

type Props = {
  editingId: number | null;
  onClose: () => void;
};

export function FuelForm({ editingId, onClose }: Props) {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const { t, isRTL } = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { mutate: updateService, isPending: isPendingUpdate } = useUpdateFuel(
    editingId!,
  );
  const { mutate: createService, isPending: isPendingCreate } = useCreateFuel();
  const { data } = useGetFuel(editingId);

  const schema = fuelSchema(t);
  const {
    watch,
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

    // fill form in edit mode
    reset({
      date: data.date,
      note: data.note,
      odometer: data.odometer,
      fullTank: data.fullTank,
      liters: data.liters,
      pricePerLiter: data.pricePerLiter,
      station: data.station,
      totalCost: data.totalCost,
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

  const handleSave = async (formData: FuelFormData) => {
    const fuel: Omit<FuelDto, "id"> = {
      date: formData.date,
      odometer: formData.odometer,
      note: formData.note ?? null,
      createdAt: null,
      updatedAt: null,
      fullTank: formData.fullTank,
      liters: formData.liters,
      pricePerLiter: formData.pricePerLiter,
      totalCost: Number(formData.liters) * Number(formData.pricePerLiter),
      station: formData.station ?? null,
    };

    if (editingId) {
      updateService(fuel, {
        onSuccess: () => {
          Toast({ text: t("common.saved") });
        },
      });
    } else {
      createService(fuel, {
        onSuccess: () => {
          Toast({ text: t("common.saved") });
        },
      });
    }

    handleClose();
    handleResetForm();
  };

  const liters = watch("liters");
  const pricePerLiter = watch("pricePerLiter");
  const totalCost =
    liters && pricePerLiter
      ? (Number(liters) * Number(pricePerLiter)).toFixed(2)
      : "0.00";

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
            globalStyles.fabFuel,
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
                {editingId ? t("fuel.updateTitle") : t("fuel.createTitle")}
              </Text>
              <IconButton icon={XIcon} onPress={() => handleClose()} />
            </View>

            <ScrollView
              style={globalStyles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <Controller
                control={control}
                name="date"
                render={({ field: { value, onChange } }) => (
                  <>
                    <DatePicker
                      label={t("fuel.date")}
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
                      label={t("fuel.odometer")}
                      value={value?.toString() ?? ""}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text === "" ? undefined : Number(text));
                      }}
                      keyboardType="numeric"
                      placeholder={t("fuel.odometerPlaceholder")}
                      style={{ direction: "ltr" }}
                      error={errors?.odometer?.message}
                    />
                  </>
                )}
              />

              <Controller
                control={control}
                name="liters"
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <Input
                      label={t("fuel.liters")}
                      value={value?.toString() ?? ""}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text === "" ? undefined : Number(text));
                      }}
                      keyboardType="numeric"
                      placeholder={t("fuel.litersPlaceholder")}
                      style={{ direction: "ltr" }}
                      error={errors?.liters?.message}
                    />
                  </>
                )}
              />

              <Controller
                control={control}
                name="pricePerLiter"
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <Input
                      label={t("fuel.price")}
                      value={value?.toString() ?? ""}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text === "" ? undefined : Number(text));
                      }}
                      keyboardType="decimal-pad"
                      placeholder={t("fuel.pricePlaceholder")}
                      style={{ direction: "ltr" }}
                      error={errors?.pricePerLiter?.message}
                    />
                  </>
                )}
              />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{t("fuel.totalCost")}</Text>
                <PriceValue value={totalCost} />
              </View>

              <Controller
                control={control}
                name="fullTank"
                render={({ field: { value, onChange } }) => (
                  <>
                    <SwitchToggle
                      label={t("fuel.fullTank")}
                      value={value ?? false}
                      onValueChange={(value) => onChange(value)}
                      description={t("fuel.fullTankPlaceholder")}
                    />
                  </>
                )}
              />

              <Controller
                control={control}
                name="station"
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <Input
                      label={t("fuel.station")}
                      value={value?.toString() ?? ""}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder={t("fuel.stationPlaceHolder")}
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
                      label={t("fuel.note")}
                      value={value ?? ""}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder={t("fuel.notePlaceholder")}
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
                  <FuelDeletionModal
                    editingId={editingId!}
                    onConfirm={() => handleClose()}
                  />
                )}
                <Button
                  title={editingId ? t("common.update") : t("common.save")}
                  onPress={handleSubmit(handleSave)}
                  loading={isPendingUpdate || isPendingCreate}
                  // disabled={!isValid}
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

const styles = StyleSheet.create({
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
