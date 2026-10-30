import { Text } from "@/components/Text";
import { Theme } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { numberFormat } from "@/utils/number-format";
import { StyleSheet, type TextStyle, View } from "react-native";

interface Props {
  value: number;
  help: string;
  helpLocation?: "left" | "right";
  style?: TextStyle;
}

export function ValueWithHelp({
  value,
  help,
  helpLocation = "left",
  style,
}: Props) {
  const { isRTL } = useTranslation();

  return (
    <View style={styles.valuesContainer}>
      {helpLocation === "right" && <Text style={styles.span}>{help}</Text>}
      <Text style={[styles.value, style]}>
        {numberFormat(value, { isRTL })}
      </Text>
      {helpLocation === "left" && <Text style={styles.span}>{help}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  valuesContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    gap: 3,
  },
  value: {
    fontSize: 20,
    fontWeight: 700,
    color: Theme.text,
  },
  span: {
    fontSize: 12,
    color: Theme.textSecondary,
  },
});
