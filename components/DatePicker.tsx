import { Text } from '@/components/AppText';
import { Colors } from '@/constants/theme';
import { useAppFontFamily } from '@/hooks/useAppFontFamily';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export function DatePicker({ label, value, onChange, placeholder = 'Select date...' }: DatePickerProps) {
  const [visible, setVisible] = useState(false);
  const fontFamily = useAppFontFamily();

  const handleDayPress = (day: { dateString: string }) => {
    onChange(day.dateString);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [styles.selector, pressed && styles.selectorPressed]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.selectorText, !value && styles.placeholder]}>
          {value ? format(value, 'MMM d, yyyy') : placeholder}
        </Text>
        <CalendarIcon
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
            <Calendar
              onDayPress={handleDayPress}
              markedDates={
                value
                  ? {
                      [value]: {
                        selected: true,
                        selectedColor: Colors.primary,
                      },
                    }
                  : undefined
              }
              theme={{
                backgroundColor: Colors.surface,
                calendarBackground: Colors.surface,
                textSectionTitleColor: Colors.textSecondary,
                selectedDayBackgroundColor: Colors.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: Colors.primary,
                dayTextColor: Colors.text,
                textDisabledColor: Colors.textMuted,
                arrowColor: Colors.primary,
                monthTextColor: Colors.text,
                textMonthFontWeight: 600,
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 12,
                ...(fontFamily
                  ? {
                      textDayFontFamily: fontFamily,
                      textMonthFontFamily: fontFamily,
                      textDayHeaderFontFamily: fontFamily,
                    }
                  : {}),
              }}
              style={styles.calendar}
            />
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
    overflow: 'hidden',
  },
  calendar: {
    borderRadius: 20,
  },
});
