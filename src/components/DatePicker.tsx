import dayjs from "dayjs";
import { CalendarIcon, XIcon } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/components/Text";
import { Theme } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { dateFormat } from "@/utils/date-format";
import { IconButton } from "./IconButton";
import { Button } from "./Button";
import { WheelDatePicker } from "./WheelDatePicker";

interface DatePickerProps {
  label: string;
  value: string | null;
  error?: string;
  onChange: (date: string | null) => void;
}

export function DatePicker({ label, value, error, onChange }: DatePickerProps) {
  const { t, isRTL } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [draftDate, setDraftDate] = useState(
    value ? new Date(value) : dayjs().toDate(),
  );

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
        onPress={() => {
          setDraftDate(value ? new Date(value) : dayjs().toDate());
          setVisible(true);
        }}
      >
        <Text style={styles.selectorText}>
          {dateFormat(isRTL, value ?? "")}
        </Text>
        <CalendarIcon size={20} color={Theme.textSecondary} />
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("common.selectDate")}</Text>
              <IconButton icon={XIcon} onPress={() => setVisible(false)} />
            </View>
            <WheelDatePicker
              value={draftDate}
              isRTL={isRTL}
              onChange={setDraftDate}
            />
            <View style={styles.buttonRow}>
              <Button
                title={t("common.today")}
                style={styles.button}
                variant="plain"
                color="gray"
                onPress={() => handleToday()}
              />
              <Button
                title={t("common.clear")}
                style={styles.button}
                variant="plain"
                color="gray"
                onPress={() => handleClear()}
              />
              <Button
                title={t("common.ok")}
                style={styles.button}
                variant="subtle"
                color="blue"
                onPress={() => {
                  onChange(draftDate.toISOString());
                  setVisible(false);
                }}
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
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderLight,
  },
  modalTitle: {
    color: Theme.text,
  },
  button: {
    flex: 1,
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
    color: Theme.danger,
    marginTop: 4,
  },
  borderError: {
    borderColor: Theme.danger,
  },
});
