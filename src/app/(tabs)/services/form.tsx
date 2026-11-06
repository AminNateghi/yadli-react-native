import { useEffect, useLayoutEffect, useState } from "react";
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
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { type ServiceFormData, serviceSchema } from "@/types/service-schema";
import { MultiSelectPicker } from "@/components/MultiSelectPicker";
import { DatePicker } from "@/components/DatePicker";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ServiceDeletionModal } from "@/components/forms/ServiceDeletionModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useStatistics } from "@/repositories/statistics";
import { DATE_FORMAT } from "@/utils/date-format";
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
  useGetReminderForService,
} from "@/repositories/reminder-repository";

const defaultValues = {
  type: ["EngineOil"],
  date: dayjs().toISOString(),
  odometer: undefined,
  cost: undefined,
  note: "",
};

export default function ServiceForm() {
  const params = useLocalSearchParams<{ id?: string; reminderId?: string }>();
  const [id] = useState<number>(Number(params.id));
  const reminderId = Number(params.reminderId) || null;
  const navigation = useNavigation();
  const { t, isRTL } = useTranslation();
  const { data: activeVehicle } = useActiveVehicle();
  const { statistics } = useStatistics();
  const isEditMode = !!id;

  const { mutate: updateService, isPending: isPendingUpdate } =
    useUpdateService(id);
  const { mutate: createService, isPending: isPendingCreate } =
    useCreateService();
  const { data } = useGetService(id);
  const { data: linkedReminder, isSuccess: linkedReminderLoaded } =
    useGetReminderForService(id || null);
  const { data: completingReminder, isSuccess: completingReminderLoaded } =
    useGetReminder(reminderId);
  const [reminderSettings, setReminderSettings] =
    useState<ReminderSettingsFormValues | null>(null);
  const [reminderSettingsTouched, setReminderSettingsTouched] = useState(false);
  const [reminderSettingsError, setReminderSettingsError] = useState<string>();

  const schema = serviceSchema(t);
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
  const selectedServiceTypes = watch("type") as ServiceType[];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditMode ? t("services.updateTitle") : t("services.createTitle"),
      headerLargeTitle: true,
      headerTitleAlign: "center",
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
      cost: data.cost,
      date: dayjs(data.date).format(DATE_FORMAT),
      note: data.note,
      odometer: data.odometer,
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
    if (completingReminder?.service) {
      reset({ ...defaultValues, type: completingReminder.service.type });
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

  const handleSave = async (formData: ServiceFormData) => {
    const parsedReminder =
      reminderSettings !== null
        ? parseReminderSettings(reminderSettings, {
            serviceTypes: selectedServiceTypes,
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
    const service: Omit<ServiceDto, "id" | "vehicleId"> = {
      type: formData.type as ServiceType[],
      date: dayjs(formData.date).toDate(),
      odometer: formData.odometer,
      cost: formData.cost,
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

    if (id) updateService({ ...service, ...reminderOptions }, callbacks);
    else createService({ ...service, ...reminderOptions }, callbacks);
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
          <MultiSelectPicker
            label={t("services.serviceType")}
            value={value}
            options={serviceTypeOptions(t)}
            onValueChange={onChange}
            error={errors?.type?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="date"
        render={({ field: { value, onChange } }) => (
          <DatePicker
            label={t("services.date")}
            value={value}
            onChange={onChange}
            error={errors?.date?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="odometer"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label={t("services.odometer")}
            value={value?.toString() ?? ""}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType="numeric"
            placeholder={t("services.odometerPlaceholder")}
            style={{ direction: "ltr" }}
            error={errors?.odometer?.message}
            help={`${t("dashboard.latestOdometer")} ${numberFormat(statistics.distance.latestOdometer, { isRTL })}`}
          />
        )}
      />

      <Controller
        control={control}
        name="cost"
        render={({ field: { value, onChange, onBlur } }) => (
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
        )}
      />

      <Controller
        control={control}
        name="note"
        render={({ field: { value, onChange, onBlur } }) => (
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
        )}
      />

      {(!id || linkedReminderLoaded) &&
        (reminderId === null || completingReminderLoaded) && (
          <ReminderSettings
            value={reminderSettings}
            serviceTypes={selectedServiceTypes}
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
          style={{ flex: 1 }}
        />
        {isEditMode && (
          <ServiceDeletionModal
            editingId={id}
            onConfirm={() => handleClose()}
          />
        )}
      </View>

      <View style={{ height: 40 }} />
    </KeyboardAwareScrollView>
  );
}
