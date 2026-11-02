import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "@/components/Button";
import { DatePicker } from "@/components/DatePicker";
import { Input } from "@/components/Input";
import { SelectPicker } from "@/components/SelectPicker";
import { GlobalStyles, ReportStyles } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import {
  useCreateVehicle,
  useGetVehicle,
  useUpdateVehicle,
} from "@/repositories/vehicle-repository";
import {
  vehicleFuelTypeOptions,
  vehicleTypeOptions,
  type FuelType,
  type VehicleDto,
  type VehicleType,
} from "@/types/interfaces";
import { type VehicleFormData, vehicleSchema } from "@/types/vehicle-schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VehicleDeletionModal } from "@/components/forms/VehicleDeletionModal";

const defaultValues: VehicleFormData = {
  customName: "",
  makeModel: undefined,
  year: undefined,
  purchaseDate: undefined,
  purchasePrice: undefined,
  purchaseOdometer: undefined,
  type: undefined,
  fuelType: undefined,
  capacity: undefined,
};

function optionalNumber(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function VehicleFormScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [id] = useState<number>(Number(params.id));
  const [isEditMode] = useState<boolean>(Number(params.id) > 0);
  const { t, isRTL } = useTranslation();

  const { mutate: updateVehicle, isPending: isPendingUpdate } =
    useUpdateVehicle(id!);
  const { mutate: createVehicle, isPending: isPendingCreate } =
    useCreateVehicle();
  const { data } = useGetVehicle(isEditMode ? Number(id) : null);

  const schema = vehicleSchema(t);
  const {
    control,
    reset,
    handleSubmit,
    watch,
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
      capacity: data.capacity?.toString() ?? "",
      customName: data.customName,
      fuelType: data.fuelType ?? undefined,
      makeModel: data.makeModel ?? "",
      purchaseDate: data.purchaseDate
        ? new Date(data.purchaseDate).toISOString()
        : undefined,
      purchaseOdometer: data.purchaseOdometer?.toString() ?? "",
      purchasePrice: data.purchasePrice?.toString() ?? "",
      type: data.type ?? undefined,
      year: data.year?.toString() ?? "",
    });
  }, [data, id, reset]);

  const handleResetForm = () => {
    reset(defaultValues);
  };

  const handleClose = () => {
    handleResetForm();
    router.back();
  };

  const handleSave = async (formData: VehicleFormData) => {
    const vehicle: Omit<VehicleDto, "id"> = {
      capacity: optionalNumber(String(formData.capacity)),
      customName: formData.customName.trim(),
      fuelType: formData.fuelType as FuelType,
      makeModel: formData.makeModel?.trim() ?? null,
      purchaseDate: formData.purchaseDate
        ? new Date(formData.purchaseDate)
        : null,
      purchaseOdometer: optionalNumber(String(formData.purchaseOdometer)),
      purchasePrice: optionalNumber(String(formData.purchasePrice)),
      type: (formData.type as VehicleType) ?? null,
      year: optionalNumber(String(formData.year)),
    };

    if (id) {
      updateVehicle(vehicle);
    } else {
      createVehicle(vehicle);
    }

    handleClose();
    handleResetForm();
  };

  const fuelType = watch("fuelType") as FuelType | undefined;

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
        name="customName"
        render={({ field: { value, onChange } }) => (
          <Input
            label={t("vehicles.customName")}
            value={value}
            onChangeText={onChange}
            autoCapitalize="words"
            error={errors.customName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="type"
        render={({ field: { value, onChange } }) => (
          <SelectPicker
            label={t("vehicles.type")}
            value={value?.toString() ?? ""}
            options={vehicleTypeOptions(t)}
            onValueChange={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="makeModel"
        render={({ field: { value, onChange } }) => (
          <Input
            label={t("vehicles.makeModel")}
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="year"
        render={({ field: { value, onChange } }) => (
          <Input
            label={t("vehicles.year")}
            value={value?.toString() ?? ""}
            onChangeText={onChange}
            keyboardType="number-pad"
            style={{ direction: "ltr" }}
          />
        )}
      />

      <Controller
        control={control}
        name="purchaseDate"
        render={({ field: { value, onChange } }) => (
          <DatePicker
            label={t("vehicles.purchaseDate")}
            value={value ? new Date(value).toISOString() : null}
            onChange={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="purchasePrice"
        render={({ field: { value, onChange } }) => (
          <View style={{ flex: 1 }}>
            <Input
              label={t("vehicles.purchasePrice")}
              value={value?.toString() ?? ""}
              onChangeText={onChange}
              keyboardType="decimal-pad"
              style={{ direction: "ltr" }}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="purchaseOdometer"
        render={({ field: { value, onChange } }) => (
          <Input
            label={t("vehicles.purchaseOdometer")}
            value={value?.toString() ?? ""}
            onChangeText={onChange}
            keyboardType="number-pad"
            style={{ direction: "ltr" }}
          />
        )}
      />

      <View style={ReportStyles.row}>
        <Controller
          control={control}
          name="fuelType"
          render={({ field: { value, onChange } }) => (
            <View style={{ flex: 1 }}>
              <SelectPicker
                label={t("vehicles.fuelType")}
                value={value?.toString() ?? ""}
                options={vehicleFuelTypeOptions(t)}
                onValueChange={onChange}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="capacity"
          render={({ field: { value, onChange } }) => (
            <View style={{ flex: 1 }}>
              <Input
                label={
                  fuelType === "Electric"
                    ? t("vehicles.batteryCapacity")
                    : fuelType === "CNG/LPG"
                      ? t("vehicles.cngCapacity")
                      : t("vehicles.fuelCapacity")
                }
                value={value?.toString() ?? ""}
                onChangeText={onChange}
                keyboardType="decimal-pad"
                style={{ direction: "ltr" }}
              />
            </View>
          )}
        />
      </View>

      <View style={GlobalStyles.buttonColumn}>
        <Button
          title={id ? t("common.update") : t("common.save")}
          onPress={handleSubmit(handleSave)}
          loading={isPendingUpdate || isPendingCreate}
          style={{ flex: 1 }}
        />
        {isEditMode && (
          <VehicleDeletionModal
            editingId={id!}
            onConfirm={() => handleClose()}
          />
        )}
      </View>

      <View style={{ height: 40 }} />
    </KeyboardAwareScrollView>
  );
}
