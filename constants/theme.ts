import { LanguageType } from '@/types/interfaces';
import { StyleSheet } from 'react-native';

const Fonts = {
  persian: 'VazirMatn',
} as const;

export const getAppFontFamily = (language: LanguageType): string | undefined =>
  language === 'fa' ? Fonts.persian : undefined;

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
