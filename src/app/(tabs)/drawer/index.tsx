import { StyleSheet, View } from "react-native";
import { ChangeLanguageForm } from "@/components/ChangeLanguageForm";
import { ResetAllData } from "@/components/ResetAllData";

export default function ServiceRemindersScreen() {
  return (
    <View style={styles.content}>
      <ChangeLanguageForm />
      <ResetAllData />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 10,
  },
});
