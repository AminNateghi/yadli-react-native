import { Theme } from "@/constants";
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
    backgroundColor: Theme.surfaceAlt,
    borderRadius: Theme.borderRadius,
    padding: 12,
    paddingBottom: 0,
    marginBottom: 10,
  },
  title: {
    color: Theme.text,
    fontSize: 12,
    paddingBottom: 5,
  },
});
