import { Colors } from "@/constants";
import { StyleSheet, View } from "react-native";
import { Text } from "./Text";

interface DoubleLabelProps {
  size: "small" | "large";
  topLabel: string;
  bottomLabel: string;
  topSpanLabel?: string;
  bottomSpanLabel?: string;
}

export function DoubleLabel({
  bottomLabel,
  topLabel,
  topSpanLabel,
  bottomSpanLabel,
  size,
}: DoubleLabelProps) {
  return (
    <View style={styles.labelContainer}>
      <View style={styles.row}>
        <Text style={size === "large" ? styles.topLabelLarge : styles.topLabel}>
          {topLabel}
        </Text>
        {topSpanLabel && <Text style={styles.spanLabel}>{topSpanLabel}</Text>}
      </View>
      <View style={styles.row}>
        <Text
          style={
            size === "large" ? styles.bottomLabelLarge : styles.bottomLabel
          }
        >
          {bottomLabel}
        </Text>
        {bottomSpanLabel && (
          <Text style={styles.spanLabel}>{bottomSpanLabel}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
  },
  labelContainer: {
    flexDirection: "column",
    flex: 1,
    gap: 2,
  },
  topLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  bottomLabel: {
    fontSize: 12,
    fontWeight: 300,
    color: Colors.textSecondary,
  },
  topLabelLarge: {
    fontSize: 13,
    fontWeight: 300,
    color: Colors.textSecondary,
  },
  bottomLabelLarge: {
    fontSize: 22,
    fontWeight: "bold",
  },
  spanLabel: {
    fontSize: 11,
    fontWeight: 300,
    color: Colors.textSecondary,
  },
});
