import { Text } from "@/components/Text";
import { Theme } from "@/constants";
import type { LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet, type ViewStyle } from "react-native";

interface FloatButton {
  icon: LucideIcon;
  text?: string;
  color?: "gray" | "red" | "green" | "blue" | "orange";
  placement?: "left" | "right";
  style?: ViewStyle;
  onPress: () => void;
}

const PALETTE = {
  gray: "#1f1f21",
  blue: "#007AFF",
  green: "#16a34a",
  orange: "#ea580c",
  red: "#dc2626",
};
const foregroundColor = "#ffffff";

export function FloatButton({
  text,
  color = "blue",
  placement = "left",
  style,
  icon: Icon,
  onPress,
}: FloatButton) {
  const baseColor = PALETTE[color];

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: baseColor,
          borderColor: baseColor,
        },

        text ? styles.buttonWithText : styles.button,
        placement === "left" ? styles.placementLeft : styles.placementRight,
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
    >
      {placement === "right" && text && (
        <Text style={[styles.text, { color: foregroundColor }]}>{text}</Text>
      )}
      <Icon color={foregroundColor} />
      {placement === "left" && text && (
        <Text style={[styles.text, { color: foregroundColor }]}>{text}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  placementRight: {
    right: 16,
    bottom: 16,
  },
  placementLeft: {
    left: 16,
    bottom: 16,
  },

  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 2,
  },
  buttonWithText: {
    flexDirection: "row",
    height: 56,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 28,
    gap: 10,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 2,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: Theme.fontSize,
    fontWeight: "600",
  },
});
