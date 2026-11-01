import { Text } from "@/components/Text";
import { Theme } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { CheckIcon, ChevronDownIcon } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";

interface OptionProps {
  value: string;
  label: string;
  isGroup?: boolean;
}

interface SelectPickerProps {
  label: string;
  value: string;
  options: OptionProps[];
  placeholder?: string;
  error?: string;
  onValueChange: (value: string) => void;
}

export function SelectPicker({
  label,
  value,
  options,
  placeholder,
  error,
  onValueChange,
}: SelectPickerProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.selector,
          pressed && styles.selectorPressed,
          error && styles.borderError,
        ]}
        onPress={() => setVisible(true)}
      >
        <Text
          style={[styles.selectorText, !selectedLabel && styles.placeholder]}
        >
          {selectedLabel || placeholder || t("common.select")}
        </Text>
        <ChevronDownIcon size={20} color={Theme.textSecondary} />
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}

      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{label}</Text>
            <ScrollView style={styles.optionsList}>
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  style={({ pressed }) => [
                    option.isGroup ? styles.optionIsGroup : styles.option,
                    pressed && styles.optionPressed,
                    option.value === value && styles.optionSelected,
                  ]}
                  onPress={() => {
                    if (option.isGroup) return;
                    onValueChange(option.value);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      option.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.value === value && (
                    <CheckIcon size={20} color={Theme.primary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
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
  selector: {
    height: Theme.height,
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: Theme.borderRadius,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Theme.surface,
  },
  selectorPressed: {
    borderColor: Theme.primary,
  },
  selectorText: {
    fontSize: Theme.fontSize,
    color: Theme.text,
  },
  placeholder: {
    color: Theme.textMuted,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modal: {
    backgroundColor: Theme.surface,
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "70%",
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: Theme.text,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderLight,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingRight: 24,
    paddingLeft: 24,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderLight,
  },
  optionPressed: {
    backgroundColor: Theme.surfaceAlt,
  },
  optionSelected: {
    backgroundColor: Theme.primary + 10,
  },
  optionIsGroup: {
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    color: Theme.secondary,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderLight,
    backgroundColor: Theme.secondary + 20,
  },
  optionText: {
    fontSize: Theme.fontSize,
    color: Theme.text,
  },
  optionTextSelected: {
    color: Theme.primary,
    fontWeight: 500,
  },
  error: {
    fontSize: 12,
    color: Theme.danger,
    marginTop: 4,
  },
  borderError: {
    borderColor: Theme.danger,
  },
});
