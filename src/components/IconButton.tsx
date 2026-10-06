import { Colors } from "@/constants/theme";
import type { LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet, type ViewStyle } from "react-native";

interface ButtonProps {
  icon: LucideIcon;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function IconButton({
  icon: Icon,
  onPress,
  disabled,
  style,
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return Colors.border;
    return Colors.background + 10;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: getBackgroundColor() },
        pressed && !disabled && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Icon />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
  pressed: {
    opacity: 0.8,
  },
});
