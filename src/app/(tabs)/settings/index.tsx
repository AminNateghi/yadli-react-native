import { StyleSheet, View } from "react-native";
import { ChangeLanguageForm } from "@/components/ChangeLanguageForm";
import { ResetAllData } from "@/components/ResetAllData";
import { useTranslation } from "@/languages/useTranslation";
import { Text } from "@/components/Text";
import { CheckUpdate } from "@/components/CheckUpdate";

export default function SettingsScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.content}>
      <ChangeLanguageForm />
      <CheckUpdate />
      <ResetAllData />
      <Text style={styles.text}>{t("app.madeWithLove")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 10,
  },
  text: {
    textAlign: "center",
    fontSize: 12,
  },
});
