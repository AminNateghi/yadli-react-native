import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { CalendarIcon, XIcon } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import DateTimePicker, {
  type DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";
import { Text } from "@/components/Text";
import { Colors } from "@/constants/theme";
import { useTranslation } from "@/languages/useTranslation";
import { dateFormat } from "@/utils/dateFormat";

dayjs.extend(jalaliday);

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
}

export function DatePicker({ label, value, onChange }: DatePickerProps) {
  const { t, isRTL } = useTranslation();
  const defaultStyles = useDefaultStyles();
  const [visible, setVisible] = useState(false);

  const [date, setDate] = useState<DateType>();

  const handleDayPress = (date: string) => {
    setDate(date);
    onChange(date);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.selector,
          pressed && styles.selectorPressed,
        ]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.selectorText, !value && styles.placeholder]}>
          {dateFormat(isRTL, value)}
        </Text>
        <CalendarIcon size={20} color={Colors.textSecondary} />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("common.selectDate")}</Text>
              <Pressable onPress={() => setVisible(false)}>
                <XIcon size={24} color={Colors.text} />
              </Pressable>
            </View>
            <DateTimePicker
              mode="single"
              onChange={({ date }) => handleDayPress(String(date))}
              styles={{
                ...defaultStyles,
                today: { borderColor: "blue", borderWidth: 1 }, // Add a border to today's date
                selected: { backgroundColor: "blue" }, // Highlight the selected day
                selected_label: { color: "white" }, // Highlight the selected day label
                day_label: {
                  fontFamily: "Vazirmatn",
                },
                month_selector_label: {
                  fontFamily: "Vazirmatn",
                },
                year_selector_label: {
                  fontFamily: "Vazirmatn",
                },
                weekday_label: {
                  fontFamily: "Vazirmatn",
                },
              }}
              date={date}
              calendar={isRTL ? "jalali" : "gregory"}
              locale={isRTL ? "en" : "fa"}
              numerals={isRTL ? "arabext" : undefined}
            />
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
    color: Colors.text,
    marginBottom: 8,
  },
  selector: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modal: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
  },
  calendar: {
    borderRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitle: {
    color: Colors.text,
  },
});
