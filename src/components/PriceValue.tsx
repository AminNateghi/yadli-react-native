import { Text } from "@/components/Text";
import { Colors } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { StyleSheet, type TextStyle, View } from "react-native";

interface Props {
  value: string;
  style?: TextStyle;
}

const REGEX_SEPARATE_NUMBER = /\B(?=(\d{3})+(?!\d))/g;

const separateNumber = (isRTL: boolean, value?: number): string => {
  if (isRTL)
    return value ? value.toString().replace(REGEX_SEPARATE_NUMBER, ",") : "0";
  return value
    ? Number(value.toString().replace(REGEX_SEPARATE_NUMBER, ",")).toFixed(2)
    : "0,00";
};

export function PriceValue({ value, style }: Props) {
  const { t, isRTL } = useTranslation();

  return (
    <View style={styles.valuesContainer}>
      {!isRTL && <Text style={styles.signMedium}>{t("common.priceSign")}</Text>}
      <Text style={[styles.value, style]}>
        {isRTL
          ? separateNumber(isRTL, Number(value))
          : separateNumber(isRTL, Number(value))}
      </Text>
      {isRTL && <Text style={styles.signSmall}>{t("common.priceSign")}</Text>}
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
    color: Colors.text,
  },
  signSmall: {
    fontSize: 12,
  },
  signMedium: {
    fontSize: 14,
  },
});
