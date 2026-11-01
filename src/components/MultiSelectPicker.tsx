import { Text } from "@/components/Text";
import { Theme } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { CheckIcon, ChevronDownIcon } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";

interface MultiSelectOption {
  value: string;
  label: string;
  isGroup?: boolean;
}

interface MultiSelectPickerProps {
  label: string;
  value: string[];
  options: MultiSelectOption[];
  placeholder?: string;
  error?: string;
  onValueChange: (value: string[]) => void;
}

export function MultiSelectPicker({
  label,
  value,
  options,
  placeholder,
  error,
  onValueChange,
}: MultiSelectPickerProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const selectedLabels = value
    .map(
      (selectedValue) =>
        options.find((option) => option.value === selectedValue)?.label,
    )
    .filter((selectedLabel): selectedLabel is string => !!selectedLabel);

  const toggleOption = (optionValue: string) => {
    onValueChange(
      value.includes(optionValue)
        ? value.filter((selectedValue) => selectedValue !== optionValue)
        : [...value, optionValue],
    );
  };

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
          style={[
            styles.selectorText,
            !selectedLabels.length && styles.placeholder,
          ]}
        >
          {selectedLabels.join(", ") || placeholder || t("common.select")}
        </Text>
        <ChevronDownIcon size={20} color={Theme.textSecondary} />
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setVisible(false)}
          />
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{label}</Text>
            <ScrollView style={styles.optionsList}>
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <Pressable
                    key={option.value}
                    style={({ pressed }) => [
                      option.isGroup ? styles.optionIsGroup : styles.option,
                      pressed && styles.optionPressed,
                      isSelected && styles.optionSelected,
                    ]}
                    accessibilityRole={option.isGroup ? undefined : "checkbox"}
                    accessibilityState={
                      option.isGroup ? undefined : { checked: isSelected }
                    }
                    onPress={() => {
                      if (option.isGroup) return;
                      toggleOption(option.value);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {!option.isGroup && (
                      <View
                        style={[
                          styles.checkbox,
                          isSelected && styles.checkboxSelected,
                        ]}
                      >
                        {isSelected && (
                          <CheckIcon size={16} color={Theme.surface} />
                        )}
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
            <Pressable
              style={({ pressed }) => [
                styles.doneButton,
                pressed && styles.optionPressed,
              ]}
              onPress={() => setVisible(false)}
              accessibilityRole="button"
            >
              <Text style={styles.doneText}>{t("common.ok")}</Text>
            </Pressable>
          </View>
        </View>
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
    minHeight: Theme.height,
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: Theme.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Theme.surface,
  },
  selectorPressed: {
    borderColor: Theme.primary,
  },
  selectorText: {
    flex: 1,
    fontSize: Theme.fontSize,
    color: Theme.text,
    marginEnd: 8,
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
    maxHeight: "80%",
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
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderLight,
  },
  optionPressed: {
    backgroundColor: Theme.surfaceAlt,
  },
  optionSelected: {
    backgroundColor: `${Theme.primary}10`,
  },
  optionIsGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderLight,
    backgroundColor: `${Theme.secondary}20`,
  },
  optionText: {
    fontSize: Theme.fontSize,
    color: Theme.text,
  },
  optionTextSelected: {
    color: Theme.primary,
    fontWeight: 500,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    borderColor: Theme.primary,
    backgroundColor: Theme.primary,
  },
  doneButton: {
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Theme.borderLight,
  },
  doneText: {
    color: Theme.primary,
    fontSize: Theme.fontSize,
    fontWeight: 600,
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
