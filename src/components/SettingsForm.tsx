import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Colors, globalStyles } from "@/constants/theme";
import { useTranslation } from "@/languages/useTranslation";
import { LANGUAGE_TYPE, type LanguageType } from "@/types/interfaces";
import { Button } from "./Button";
import { SelectPicker } from "./SelectPicker";
import {
  useGetProfile,
  useSaveProfileLanguage,
} from "@/repositories/profile-repository";
import { useRouter } from "expo-router";

export function SettingsForm() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const [language, setLanguage] = useState<LanguageType>("fa");

  const { data } = useGetProfile();
  const { mutate: saveLanguage } = useSaveProfileLanguage();

  useEffect(() => {
    if (data) {
      setLanguage(data.language ?? "fa");
    }
  }, [data]);

  const handleSave = () => {
    saveLanguage(language);
    router.back();
  };

  return (
    <View style={[styles.content, isRTL && globalStyles.rtl]}>
      <SelectPicker
        label={t("settings.language")}
        value={language}
        options={LANGUAGE_TYPE}
        onValueChange={(value) => setLanguage(value as LanguageType)}
      />

      <View style={styles.buttonRow}>
        <Button
          title={t("common.save")}
          onPress={handleSave}
          style={{ flex: 1 }}
        />
      </View>
      <View style={{ height: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    maxHeight: "90%",
    padding: 16,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
  },
});
