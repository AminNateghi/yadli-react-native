import { StyleSheet, View } from "react-native";
import { SettingsForm } from "@/components/SettingsForm";
import { ResetAllData } from "@/components/ResetAllData";

export default function ServiceRemindersScreen() {
  return (
    <View style={styles.content}>
      <SettingsForm />
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
