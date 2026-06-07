import { isBoldFontWeight } from '@/constants/theme';
import { useAppFontFamily } from '@/hooks/useAppFontFamily';
import { StyleSheet, Text as RNText, TextInput as RNTextInput, TextInputProps, TextProps } from 'react-native';

function resolveTextStyle(fontFamily: string | undefined, style: TextProps['style']) {
  const flat = StyleSheet.flatten(style);

  if (!fontFamily || !flat?.fontWeight || !isBoldFontWeight(flat.fontWeight)) {
    return [fontFamily && { fontFamily }, style];
  }

  const { fontWeight: _fontWeight, ...rest } = flat;
  return [{ fontFamily }, rest];
}

export function Text({ style, ...props }: TextProps) {
  const fontFamily = useAppFontFamily(style);

  return (
    <RNText
      style={resolveTextStyle(fontFamily, style)}
      {...props}
    />
  );
}

export function TextInput({ style, ...props }: TextInputProps) {
  const fontFamily = useAppFontFamily(style);

  return (
    <RNTextInput
      style={resolveTextStyle(fontFamily, style)}
      {...props}
    />
  );
}
