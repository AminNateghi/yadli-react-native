import { Text } from "@/components/Text";
import { Theme } from "@/constants";
import type { LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet, type ViewStyle } from "react-native";

interface FloatButton {
  icon: LucideIcon;
  text?: string;
  color?: string;
  placement?: "left" | "right";
  style?: ViewStyle;
  onPress: () => void;
}

const foregroundColor = "#ffffff";

export function FloatButton({
  text,
  color = Theme.primary,
  placement = "left",
  style,
  icon: Icon,
  onPress,
}: FloatButton) {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: color,
          borderColor: color,
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
