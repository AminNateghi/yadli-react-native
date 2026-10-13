import { StyleSheet, View } from "react-native";
import { SettingsForm } from "@/components/SettingsForm";

export default function ServiceRemindersScreen() {
  return (
    <View style={styles.content}>
      <SettingsForm />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});
