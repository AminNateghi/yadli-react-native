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

  const [date, setDate] = useState<DateType>();

  const handleDayPress = (date: string) => {
    setDate(date);
    onChange(date);
    setVisible(false);
  };

  const handleClear = () => {
    setDate(undefined);
    onChange(null);
    setVisible(false);
  };

  const handleToday = () => {
    const today = new Date();
    setDate(today);
    onChange(today.toISOString());
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
        {value === null ||
        value === undefined ||
        value === "" ||
        value === "null" ? (
          <Text></Text>
        ) : (
          <Text style={[styles.selectorText, !value && styles.placeholder]}>
            {dateFormat(isRTL, value ?? "")}
          </Text>
        )}

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
            <DateTimePicker
              mode="single"
              onChange={({ date }) => handleDayPress(String(date))}
              styles={{
                ...defaultStyles,
                today: { borderColor: "blue", borderWidth: 1 }, // Add a border to today's date
                selected: { backgroundColor: "blue" }, // Highlight the selected day
                selected_label: { color: "white" }, // Highlight the selected day label
                day_label: {
                  fontFamily: "VazirRegular",
                },
                month_selector_label: {
                  fontFamily: "VazirRegular",
                },
                year_selector_label: {
                  fontFamily: "VazirRegular",
                },
                weekday_label: {
                  fontFamily: "VazirRegular",
                },
                month_label: {
                  fontFamily: "VazirRegular",
                },
              }}
              date={date}
              calendar={isRTL ? "jalali" : "gregory"}
              locale={isRTL ? "fa" : "en"}
              numerals={isRTL ? "arabext" : undefined}
              firstDayOfWeek={isRTL ? 6 : 0}
              weekdaysFormat="min"
              monthsFormat="full"
              monthCaptionFormat="full"
            />
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
});
