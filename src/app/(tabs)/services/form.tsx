import { useEffect, useState } from "react";
import { View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalStyles } from "@/constants";
import {
  useCreateService,
  useGetService,
  useUpdateService,
} from "@/repositories/service-repository";
import { useTranslation } from "@/languages/useTranslation";
import {
  type ServiceDto,
  type ServiceType,
  serviceTypeOptions,
} from "@/types/interfaces";
import { router, useLocalSearchParams } from "expo-router";
import { type ServiceFormData, serviceSchema } from "@/types/service-schema";
import { SelectPicker } from "@/components/SelectPicker";
import { DatePicker } from "@/components/DatePicker";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ServiceDeletionModal } from "@/components/forms/ServiceDeletionModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import dayjs from "dayjs";

const defaultValues = {
  type: "EngineOil",
  date: dayjs().format("yyyy-MM-dd"),
  odometer: undefined,
  cost: undefined,
  note: "",
};

export default function ServiceForm() {
  const params = useLocalSearchParams<{ id: string }>();
  const [id] = useState<number>(Number(params.id));
  const [isEditMode] = useState<boolean>(Number(params.id) > 0);
  const { t, isRTL } = useTranslation();

  const { mutate: updateService, isPending: isPendingUpdate } =
    useUpdateService(id!);
  const { mutate: createService, isPending: isPendingCreate } =
    useCreateService();
  const { data } = useGetService(id);

  const schema = serviceSchema(t);
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
      cost: data.cost,
      date: String(data.date),
      note: data.note,
      odometer: data.odometer,
    });
  }, [data, id, reset]);

  const handleResetForm = () => {
    reset(defaultValues);
  };

  const handleClose = () => {
    handleResetForm();
    router.back();
  };

  const handleSave = async (formData: ServiceFormData) => {
    const service: Omit<ServiceDto, "id"> = {
      type: formData.type as ServiceType,
      date: new Date(formData.date),
      odometer: formData.odometer,
      cost: formData.cost,
      note: formData.note ?? null,
    };

    if (id) {
      updateService(service);
    } else {
      createService(service);
    }

    handleClose();
    handleResetForm();
  };

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
              error={errors?.date?.message}
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
              onChangeText={onChange}
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
              onChangeText={onChange}
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

      <View style={GlobalStyles.buttonColumn}>
        <Button
          title={id ? t("common.update") : t("common.save")}
          onPress={handleSubmit(handleSave)}
          loading={isPendingUpdate || isPendingCreate}
          style={{ flex: 1 }}
        />
        {isEditMode && (
          <ServiceDeletionModal
            editingId={id!}
            onConfirm={() => handleClose()}
          />
        )}
      </View>

      <View style={{ height: 40 }} />
    </KeyboardAwareScrollView>
  );
}
