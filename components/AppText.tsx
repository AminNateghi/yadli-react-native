import { useAppFontFamily } from '@/hooks/useAppFontFamily';
import {
  Text as RNText,
  TextInput as RNTextInput,
  TextInputProps,
  TextProps,
} from 'react-native';

export function Text({ style, ...props }: TextProps) {
  const fontFamily = useAppFontFamily();

  return (
    <RNText
      style={[fontFamily && { fontFamily }, style]}
      {...props}
    />
  );
}

export function TextInput({ style, ...props }: TextInputProps) {
  const fontFamily = useAppFontFamily();

  return (
    <RNTextInput
      style={[fontFamily && { fontFamily }, style]}
      {...props}
    />
  );
}
