import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { CalendarIcon, XIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import { Text } from "@/components/Text";
import { Colors } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { dateFormat } from "@/utils/date-format";
import { IconButton } from "./IconButton";
import { Button } from "./Button";

dayjs.extend(jalaliday);

interface DatePickerProps {
  label: string;
  value: string | null;
  error?: string;
  onChange: (date: string | null) => void;
}

export function DatePicker({ label, value, error, onChange }: DatePickerProps) {
  const { t, isRTL } = useTranslation();
  const defaultStyles = useDefaultStyles();
  const [visible, setVisible] = useState(false);

  const [displayValue, setDisplayValue] = useState<string>("");

  useEffect(() => {
    setDisplayValue(dateFormat(isRTL, value ?? ""));
  }, [value, isRTL]);

  const handleDayPress = (date: string) => {
    onChange(date);
    setVisible(false);
  };

  const handleClear = () => {
    onChange(null);
    setVisible(false);
  };

  const handleToday = () => {
    onChange(dayjs().toDate().toISOString());
    setVisible(false);
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
        <Text style={styles.selectorText}>{displayValue}</Text>
        <CalendarIcon size={20} color={Colors.textSecondary} />
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("common.selectDate")}</Text>
              <IconButton icon={XIcon} onPress={() => setVisible(false)} />
            </View>
            <View style={{ padding: 10 }}>
              <DateTimePicker
                mode="single"
                onChange={({ date }) => handleDayPress(String(date))}
                styles={{
                  ...defaultStyles,
                  today: styles.calendarToday,
                  selected: styles.calendarSelected,
                  selected_label: styles.calendarSelectedItem,
                  day_label: styles.calendarFont,
                  month_selector_label: styles.calendarMonthSelectorLabel,
                  year_selector_label: styles.calendarYearSelectorLabel,
                  weekday_label: styles.calendarWeekdayLabel,
                  weekdays: styles.calendarWeekdays,
                  month_label: styles.calendarMonthLabel,
                  year_label: styles.calendarFont,
                  selected_year: styles.calendarSelectedItem,
                  selected_month: styles.calendarSelectedItem,
                  button_next_image: {
                    ...styles.calendarButtonNextImage,
                    transform: isRTL ? "rotate(0deg)" : "unset",
                  },
                  button_prev_image: {
                    ...styles.calendarButtonPrevImage,
                    transform: isRTL ? "rotate(0deg)" : "unset",
                  },
                }}
                date={dayjs(value).toDate()}
                calendar={isRTL ? "jalali" : "gregory"}
                locale={isRTL ? "fa" : "en"}
                numerals={isRTL ? "arabext" : undefined}
                firstDayOfWeek={isRTL ? 6 : 1}
                weekdaysFormat="min"
                monthsFormat="full"
                monthCaptionFormat="full"
                navigationPosition="around"
              />
            </View>
            <View style={styles.buttonRow}>
              <Button
                title={t("common.today")}
                style={styles.button}
                variant="outline"
                color="gray"
                onPress={() => handleToday()}
              />
              <Button
                title={t("common.clear")}
                style={styles.button}
                variant="outline"
                color="gray"
                onPress={() => handleClear()}
              />
            </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitle: {
    color: Colors.text,
  },
  button: {
    height: 45,
    fontSize: 12,
    fontWeight: 400,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  error: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
  },
  borderError: {
    borderColor: Colors.danger,
  },

  calendarFont: { fontFamily: "VazirRegular" },
  calendarToday: { borderColor: Colors.primaryDark, borderWidth: 1 },
  calendarSelected: { backgroundColor: Colors.primaryDark, borderRadius: 12 },
  calendarSelectedItem: {
    backgroundColor: Colors.primaryDark,
    color: Colors.background,
  },
  calendarMonthSelectorLabel: {
    fontFamily: "VazirRegular",
    fontSize: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 12,
  },
  calendarYearSelectorLabel: {
    fontFamily: "VazirRegular",
    fontSize: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 12,
  },
  calendarWeekdayLabel: {
    fontFamily: "VazirRegular",
  },
  calendarWeekdays: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + 30,
  },
  calendarMonthLabel: {
    fontFamily: "VazirRegular",
  },
  calendarButtonNextImage: {
    width: 24,
    height: 24,
  },
  calendarButtonPrevImage: {
    width: 24,
    height: 24,
  },
});
