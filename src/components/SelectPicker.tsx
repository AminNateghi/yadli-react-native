import { Text } from '@/components/Text';
import { Colors } from '@/constants/theme';
import { CheckIcon, ChevronDownIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

interface OptionProps {
  value: string;
  label: string;
  isGroup?: boolean;
}

interface SelectPickerProps {
  label: string;
  value: string;
  options: OptionProps[];
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function SelectPicker({ label, value, options, onValueChange, placeholder = 'Select...' }: SelectPickerProps) {
  const [visible, setVisible] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [styles.selector, pressed && styles.selectorPressed]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.selectorText, !selectedLabel && styles.placeholder]}>
          {selectedLabel || placeholder}
        </Text>
        <ChevronDownIcon
          size={20}
          color={Colors.textSecondary}
        />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType='fade'
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{label}</Text>
            <ScrollView style={styles.optionsList}>
              {options.map(option => (
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
                  <Text style={[styles.optionText, option.value === value && styles.optionTextSelected]}>
                    {option.label}
                  </Text>
                  {option.value === value && (
                    <CheckIcon
                      size={20}
                      color={Colors.primary}
                    />
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
    color: Colors.text,
    marginBottom: 8,
  },
  selector: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
  },
  selectorPressed: {
    borderColor: Colors.primary,
  },
  selectorText: {
    fontSize: 16,
    color: Colors.text,
  },
  placeholder: {
    color: Colors.textMuted,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: Colors.text,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingRight: 24,
    paddingLeft: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  optionPressed: {
    backgroundColor: Colors.surfaceAlt,
  },
  optionSelected: {
    backgroundColor: Colors.primary + '10',
  },
  optionIsGroup: {
    flexDirection: 'row',
    textAlign: 'center',
    color: Colors.secondary,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.secondary + 10,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: 500,
  },
});
