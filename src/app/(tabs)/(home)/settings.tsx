import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { SelectPicker } from "@/components/SelectPicker";
import {
  DEFAULT_CURRENCY_SYMBOL,
  DEFAULT_DISTANCE_UNIT,
  DEFAULT_FUEL_UNIT,
  Theme,
} from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import {
  useGetProfile,
  useSaveProfileSettings,
} from "@/repositories/profile-repository";
import {
  currencySymbolOptions,
  distanceUnitOptions,
  fuelUnitOptions,
} from "@/types/interfaces";
import { type SettingsFormData, settingsSchema } from "@/types/profile-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";

const defaultValues = {
  currencySymbol: DEFAULT_CURRENCY_SYMBOL,
  distanceUnit: DEFAULT_DISTANCE_UNIT,
  fuelUnit: DEFAULT_FUEL_UNIT,
};

export default function SettingsScreen() {
  const { t, isRTL } = useTranslation();
  const { data } = useGetProfile();
  const { mutate: saveSettings } = useSaveProfileSettings();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("drawer.itemSettings"),
      headerLargeTitle: true,
      headerTitleAlign: "center",
    });
  }, [navigation, t]);

  const schema = settingsSchema(t);
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
    if (!data) {
      return;
    }

    reset({
      currencySymbol: data.currencySymbol ?? DEFAULT_CURRENCY_SYMBOL,
      distanceUnit: data.distanceUnit ?? DEFAULT_DISTANCE_UNIT,
      fuelUnit: data.fuelUnit ?? DEFAULT_FUEL_UNIT,
    });
  }, [data, reset]);

  const handleSave = async (formData: SettingsFormData) => {
    saveSettings(
      { ...formData },
      {
        onSuccess: () => router.back(),
      },
    );
  };

  return (
    <ScrollView
      style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Card style={styles.card}>
        <Controller
          control={control}
          name="distanceUnit"
          render={({ field: { value, onChange } }) => (
            <SelectPicker
              label={t("settings.distanceUnit")}
              value={value}
              options={distanceUnitOptions(t)}
              onValueChange={onChange}
              error={errors.distanceUnit?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="fuelUnit"
          render={({ field: { value, onChange } }) => (
            <SelectPicker
              label={t("settings.fuelUnit")}
              value={value}
              options={fuelUnitOptions(t)}
              onValueChange={onChange}
              error={errors.fuelUnit?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="currencySymbol"
          render={({ field: { value, onChange } }) => (
            <SelectPicker
              label={t("settings.currencySymbol")}
              value={value}
              options={currencySymbolOptions(t)}
              onValueChange={onChange}
              error={errors.currencySymbol?.message}
            />
          )}
        />
      </Card>

      <Button
        title={t("common.save")}
        onPress={handleSubmit(handleSave)}
        color="blue"
        style={{ flex: 1 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  content: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
  },
});
