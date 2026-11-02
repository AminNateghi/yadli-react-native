import { Pressable, StyleSheet, View } from "react-native";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react-native";
import { useTranslation } from "@/languages/useTranslation";
import { Theme } from "@/constants";
import { Text } from "./Text";

export default function MenuItem({
  icon,
  title,
  description,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress: () => void;
}) {
  const { isRTL } = useTranslation();
  return (
    <Pressable
      style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.iconContainer}>{icon}</View>

      <View style={styles.menuText}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>

      {isRTL ? (
        <ChevronLeftIcon size={19} color={Theme.border} />
      ) : (
        <ChevronRightIcon size={19} color={Theme.border} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
    borderRadius: Theme.borderRadius,
  },
  pressed: {
    backgroundColor: Theme.border + 20,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: Theme.borderRadius,
    backgroundColor: Theme.border + 20,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  itemDescription: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
});
