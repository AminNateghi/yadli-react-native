import { Colors } from "@/constants/theme";
import { StyleSheet, View, type ViewStyle } from "react-native";
import type { PropsWithChildren } from "react";
import { Text } from "./Text";

interface CardProps extends PropsWithChildren {
  title?: string;
  style?: ViewStyle;
}

export function Card({ title, children, style }: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 10,
    padding: 12,
    paddingBottom: 0,
    marginBottom: 10,
  },
  title: {
    color: Colors.text,
    fontSize: 12,
    paddingBottom: 5,
  },
});
