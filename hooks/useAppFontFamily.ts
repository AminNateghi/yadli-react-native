import { getAppFontFamily } from '@/constants/theme';
import { useData } from '@/contexts/DataContext';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';

export const useAppFontFamily = (style?: StyleProp<TextStyle>) => {
  const { language } = useData();
  const fontWeight = StyleSheet.flatten(style)?.fontWeight;
  return getAppFontFamily(language, fontWeight);
};
