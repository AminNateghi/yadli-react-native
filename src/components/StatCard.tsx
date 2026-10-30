import { Text } from "@/components/Text";
import { Theme } from "@/constants";
import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { ValueWithHelp } from "./ValueWithHelp";

interface StatCardProps {
  title: string;
  value: number;
  help?: string;
  icon: LucideIcon;
  color: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  help,
}: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.rowTitle}>
        <View style={[styles.iconContainer, { backgroundColor: color + 15 }]}>
          <Icon size={20} color={color} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {help && <ValueWithHelp value={value} help={help} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.surface,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    minWidth: 140,
  },
  rowTitle: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    color: Theme.textSecondary,
    marginBottom: 4,
  },
});
