import { format } from "date-fns";
import { PlusIcon, XIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useMediaQuery } from "react-responsive";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Colors, globalStyles } from "@/constants/theme";
import { useTranslation } from "@/languages/useTranslation";
import { Input } from "@/components/Input";
import { type FuelFormData, fuelSchema } from "@/types/fuel-schema";
import {
  useCreateFuel,
  useGetFuel,
  useUpdateFuel,
} from "@/repositories/fuel-repository";
import type { FuelDto } from "@/types/interfaces";
import { router, useLocalSearchParams } from "expo-router";
import { DatePicker } from "@/components/DatePicker";
import { Text } from "@/components/Text";
import { PriceValue } from "@/components/PriceValue";
import { SwitchToggle } from "@/components/SwitchToggle";
import { FuelDeletionModal } from "@/components/forms/FuelDeletionModal";
import { Button } from "@/components/Button";

const defaultValues = {
  date: format(new Date(), "yyyy-MM-dd"),
  fullTank: true,
  liters: undefined,
  odometer: undefined,
  pricePerLiter: undefined,
  totalCost: undefined,
  note: "",
  station: "",
};

export default function FuelForm() {
  const params = useLocalSearchParams<{ id: string }>();
  const [id] = useState<number>(Number(params.id));
  const [editMode] = useState<boolean>(Number(params.id) > 0);
  const { t, isRTL } = useTranslation();

  const { mutate: updateService, isPending: isPendingUpdate } = useUpdateFuel(
    id!,
  );
  const { mutate: createService, isPending: isPendingCreate } = useCreateFuel();
  const { data } = useGetFuel(id);

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
    if (!id) {
      reset(defaultValues);
      return;
    }
  }, [id, reset]);

  useEffect(() => {
    if (!data || !id) {
      return;
    }

    // fill form in edit mode
    reset({
      date: String(data.date),
      note: data.note,
      odometer: data.odometer,
      fullTank: data.fullTank,
      liters: data.liters,
      pricePerLiter: data.pricePerLiter,
      station: data.station,
      totalCost: data.totalCost,
    });
  }, [data, id, reset]);

  const handleResetForm = () => {
    reset(defaultValues);
  };

  const handleClose = () => {
    handleResetForm();
    router.back();
  };

  const handleSave = async (formData: FuelFormData) => {
    const fuel: Omit<FuelDto, "id"> = {
      date: new Date(formData.date),
      odometer: formData.odometer,
      note: formData.note ?? null,
      fullTank: formData.fullTank,
      liters: formData.liters,
      pricePerLiter: formData.pricePerLiter,
      totalCost: Number(formData.liters) * Number(formData.pricePerLiter),
      station: formData.station ?? null,
    };

    if (id) {
      updateService(fuel);
    } else {
      createService(fuel);
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
    <ScrollView
      style={[globalStyles.modalScroll, isRTL && { direction: "rtl" }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
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

      <View style={globalStyles.buttonColumn}>
        <Button
          title={id ? t("common.update") : t("common.save")}
          onPress={handleSubmit(handleSave)}
          loading={isPendingUpdate || isPendingCreate}
          disabled={!isValid}
          style={{ flex: 1 }}
        />
        {editMode && (
          <FuelDeletionModal editingId={id} onConfirm={() => handleClose()} />
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
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
