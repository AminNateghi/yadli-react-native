import { Text } from "@/components/Text";
import { Colors } from "@/constants";
import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { PriceValue } from "./PriceValue";

interface StatCardProps {
  title: string;
  value: string;
  valueWithSpan?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  valueWithSpan = true,
}: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: color + 15 }]}>
        <Icon size={22} color={color} />
      </View>
      <Text style={styles.title}>{title}</Text>

      {valueWithSpan ? (
        <PriceValue value={value} />
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    minWidth: 140,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  value: {
    fontSize: 20,
    fontWeight: 700,
    color: Colors.text,
  },
});
