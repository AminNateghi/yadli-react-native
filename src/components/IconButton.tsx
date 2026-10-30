import { Theme } from "@/constants";
import type { LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet, type ViewStyle } from "react-native";
import { Text } from "./Text";

interface ButtonProps {
  icon: LucideIcon;
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "default" | "bordered";
  style?: ViewStyle;
}

export function IconButton({
  icon: Icon,
  label,
  onPress,
  disabled,
  variant = "default",
  style,
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return Theme.border;
    return Theme.background + 10;
  };

  const getVariant = () => {
    if (variant === "default") {
      return styles.default;
    }

    if (variant === "bordered") {
      return styles.bordered;
    }
  };

  const styles = StyleSheet.create({
    button: {
      height: 32,
      borderRadius: Theme.borderRadius,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      fontSize: Theme.fontSize,
    },
    pressed: {
      opacity: 0.8,
    },
    default: {
      backgroundColor: getBackgroundColor(),
    },
    bordered: {
      borderColor: Theme.border,
      borderWidth: 1,
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        getVariant(),
        pressed && !disabled && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {label && <Text>{label}</Text>}
      <Icon />
    </Pressable>
  );
}
