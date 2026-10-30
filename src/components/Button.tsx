import { Text } from "@/components/Text";
import { Palette, Theme } from "@/constants";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "solid" | "subtle" | "outline" | "plain";
  color?: "gray" | "red" | "green" | "blue" | "orange";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = "solid",
  color = "blue",
  loading,
  disabled,
  style,
}: ButtonProps) {
  const baseColor = Palette[color];

  const foregroundColor = variant === "solid" ? "#ffffff" : baseColor;

  const variantStyles = {
    solid: {
      backgroundColor: baseColor,
      borderColor: baseColor,
      borderWidth: 1,
    },
    subtle: {
      backgroundColor: `${baseColor}20`, // Appends alpha for 12% opacity
      borderColor: "transparent",
      borderWidth: 1,
    },
    outline: {
      backgroundColor: "transparent",
      borderColor: baseColor,
      borderWidth: 1,
    },
    plain: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      borderWidth: 1,
    },
  }[variant];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variantStyles,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={foregroundColor} />
      ) : (
        <Text style={[styles.text, { color: foregroundColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: Theme.height,
    borderRadius: Theme.borderRadius,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.3,
  },
  text: {
    fontSize: Theme.fontSize,
    fontWeight: "600",
  },
});
