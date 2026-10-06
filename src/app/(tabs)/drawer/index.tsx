import { useRouter } from "expo-router";
import { BellIcon, CalendarClockIcon } from "lucide-react-native";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useMediaQuery } from "react-responsive";
import { EmptyState } from "@/components/EmptyState";
import { ReminderCard } from "@/components/ReminderCard";
import { Text } from "@/components/Text";
import { Colors } from "@/constants/theme";
import { useTranslation } from "@/languages/useTranslation";
import { serviceTypeOptions } from "@/types/interfaces";
import { getServiceReminders } from "@/utils/serviceReminders";
import { SettingsForm } from "@/components/SettingsForm";

export default function ServiceRemindersScreen() {
  return (
    <View style={styles.content}>
      <SettingsForm />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  contentDesktop: {
    maxWidth: 1024,
    alignSelf: "center",
    width: "100%",
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.secondary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryContent: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
