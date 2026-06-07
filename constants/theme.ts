import { LanguageType } from '@/types/interfaces';
import { StyleSheet } from 'react-native';

export const Fonts = {
  vazirRegular: 'VazirRegular',
  vazirBold: 'VazirBold',
} as const;

export const isBoldFontWeight = (fontWeight: unknown): boolean => {
  if (fontWeight === 'bold') return true;
  if (typeof fontWeight === 'number') return fontWeight >= 600;
  if (typeof fontWeight === 'string') {
    const parsed = Number.parseInt(fontWeight, 10);
    return fontWeight === 'bold' || (!Number.isNaN(parsed) && parsed >= 600);
  }
  return false;
};

export const getAppFontFamily = (language: LanguageType, fontWeight?: unknown): string | undefined => {
  if (language !== 'fa') return undefined;
  return isBoldFontWeight(fontWeight) ? Fonts.vazirBold : Fonts.vazirRegular;
};

export const Colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  secondary: '#64748B',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',

  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',

  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',

  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  fuel: '#F59E0B',
  service: '#10B981',
  expense: '#8B5CF6',
};

export const rtlStyles = StyleSheet.create({
  rtl: {
    direction: 'rtl',
  },
});
