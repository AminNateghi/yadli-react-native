import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Colors, GlobalStyles } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { LANGUAGE_TYPE, type LanguageType } from "@/types/interfaces";
import { Button } from "./Button";
import { SelectPicker } from "./SelectPicker";
import {
  useGetProfile,
  useSaveProfileLanguage,
} from "@/repositories/profile-repository";
import { useRouter } from "expo-router";
import { Card } from "./Card";

export function ChangeLanguageForm() {
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
    <View style={[styles.content, isRTL && GlobalStyles.rtl]}>
      <Card>
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
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {},
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
    paddingBottom: 16,
  },
});
