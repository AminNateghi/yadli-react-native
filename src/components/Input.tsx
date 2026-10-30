import { StyleSheet, type TextInputProps, View } from "react-native";
import { Text, TextInput } from "@/components/Text";
import { Theme } from "@/constants";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  help?: string;
}

export function Input({ label, error, help, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={Theme.textMuted}
        {...props}
      />
      {help && <Text style={styles.help}>{help}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: Theme.text,
    marginBottom: 8,
  },
  input: {
    height: Theme.height,
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: Theme.borderRadius,
    paddingHorizontal: 16,
    fontSize: Theme.fontSize,
    color: Theme.text,
    backgroundColor: Theme.surface,
  },
  inputError: {
    borderColor: Theme.danger,
  },
  error: {
    fontSize: 12,
    color: Theme.danger,
    marginTop: 4,
  },
  help: {
    fontSize: 13,
    color: Theme.textSecondary,
    marginLeft: 5,
    marginRight: 5,
  },
});
