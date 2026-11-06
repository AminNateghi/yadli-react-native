import { useEffect, useLayoutEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { CompleteReminderModal } from "@/components/forms/CompleteReminderModal";
import { CompleteReminderOneTimeModal } from "@/components/forms/CompleteReminderOneTimeModal";
import { ReminderDeletionModal } from "@/components/forms/ReminderDeletionModal";
import {
  ReminderSettings,
  parseReminderSettings,
  reminderSettingsToForm,
  type ReminderSettingsFormValues,
} from "@/components/forms/ReminderSettings";
import { GlobalStyles } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import {
  useGetReminder,
  useUpdateReminder,
} from "@/repositories/reminder-repository";
import { getExpenseTypeTitle, getServiceTypeTitle } from "@/types/interfaces";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useActiveVehicle } from "@/repositories/active-vehicle";
import { SoldVehicleNotice } from "@/components/SoldVehicleNotice";
import { Toast } from "@/components/CustomToast";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function ReminderForm() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = Number(params.id) || null;
  const { t, isRTL } = useTranslation();
  const { data: activeVehicle } = useActiveVehicle();
  const navigation = useNavigation();
  const { data: reminder, isSuccess, isError } = useGetReminder(id);
  const { mutate: updateReminder, isPending } = useUpdateReminder(id ?? 0);
  const [settings, setSettings] = useState<ReminderSettingsFormValues | null>(
    null,
  );
  const [settingsError, setSettingsError] = useState<string>();
  const currentSettings =
    settings ?? (reminder ? reminderSettingsToForm(reminder) : null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: id ? t("reminders.updateTitle") : t("reminders.createTitle"),
      headerLargeTitle: true,
      headerTitleAlign: "center",
    });
  }, [id, navigation, t]);

  useEffect(() => {
    if (isSuccess && reminder) {
      setSettings(reminderSettingsToForm(reminder));
    }
  }, [isSuccess, reminder]);

  const handleClose = () => router.back();

  const handleSave = () => {
    if (!id || !currentSettings) return;
    const parsedSettings = parseReminderSettings(currentSettings, {
      serviceTypes: reminder?.service?.type,
      expenseType: reminder?.expenseType ?? undefined,
    });
    if (!parsedSettings) {
      setSettingsError(t("common.required"));
      return;
    }
    setSettingsError(undefined);
    updateReminder(parsedSettings, {
      onSuccess: (result) => {
        if (result.notificationSyncFailed) {
          Toast({ text: t("reminders.notificationError"), type: "warning" });
        } else if (!result.notificationPermissionGranted) {
          Toast({
            text: t("reminders.notificationPermissionDenied"),
            type: "warning",
          });
        }
        handleClose();
      },
      onError: () => {
        Toast({ text: t("reminders.saveFailed"), type: "error" });
      },
    });
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
      {!id && (
        <Card>
          <Text>{t("reminders.createFromRecord")}</Text>
          <View style={GlobalStyles.buttonColumn}>
            <Button
              title={t("services.createTitle")}
              onPress={() => router.push("/services/form")}
            />
            <Button
              title={t("expenses.createTitle")}
              onPress={() => router.push("/expenses/form")}
              color="blue"
            />
          </View>
        </Card>
      )}

      {id && isError && <Text>{t("reminders.notificationError")}</Text>}

      {id && reminder && (
        <>
          <Card title={t("reminders.linkedRecord")}>
            <Text>
              {reminder.service
                ? getServiceTypeTitle(reminder.serviceType ?? "", t)
                : reminder.expense
                  ? getExpenseTypeTitle(reminder.expenseType ?? "", t)
                  : "-"}
            </Text>
          </Card>
          <ReminderSettings
            value={currentSettings}
            serviceTypes={reminder.service?.type}
            expenseType={reminder.expenseType ?? undefined}
            showEnableToggle={false}
            onChange={(value) => {
              if (value) setSettings(value);
              setSettingsError(undefined);
            }}
            error={settingsError}
          />
          <View style={GlobalStyles.buttonColumn}>
            <Button
              title={t("common.update")}
              onPress={handleSave}
              loading={isPending}
              style={{ flex: 1 }}
            />
            <View style={GlobalStyles.buttonRow}>
              {reminder.mode === "OneTime" ? (
                <CompleteReminderOneTimeModal id={id} onConfirm={handleClose} />
              ) : (
                <CompleteReminderModal reminder={reminder} />
              )}
              <ReminderDeletionModal editingId={id} onConfirm={handleClose} />
            </View>
          </View>
        </>
      )}
      <View style={{ height: 40 }} />
    </KeyboardAwareScrollView>
  );
}
