import { MenuIcon, XIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useMediaQuery } from "react-responsive";
import { Text } from "@/components/Text";
import { Colors, globalStyles } from "@/constants/theme";
import { useTranslation } from "@/languages/useTranslation";
import { LANGUAGE_TYPE, type LanguageType } from "@/types/interfaces";
import { Button } from "./Button";
import { SelectPicker } from "./SelectPicker";
import {
  useGetProfile,
  useSaveProfileLanguage,
} from "@/contexts/profile-repository";
import { Toast } from "./CustomToast";

export function SettingsForm() {
  const { t, isRTL } = useTranslation();
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
