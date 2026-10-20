import { type StyleProp, StyleSheet, type TextStyle } from "react-native";
import { getAppFontFamily } from "@/constants";

export const useAppFontFamily = (style?: StyleProp<TextStyle>) => {
  const fontWeight = StyleSheet.flatten(style)?.fontWeight;
  return getAppFontFamily("fa", fontWeight);
};
