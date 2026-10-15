import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useTranslation } from "@/languages/useTranslation";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { Button } from "../Button";
import { Toast } from "../CustomToast";
import { useCompleteReminder } from "@/repositories/reminder-repository";
import { Modal, StyleSheet, View } from "react-native";
import { Text } from "../Text";
import { Colors } from "@/constants/theme";
import { completeReminderSchema } from "@/types/compelete-reminder-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Input } from "../Input";

const defaultValues = {
  date: format(new Date(), "yyyy-MM-dd"),
  odometer: undefined,
};

type Props = {
  id: number;
  onConfirm: () => void;
};

export function CompleteReminderModal({ id, onConfirm }: Props) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { mutate: completeItem } = useCompleteReminder();

  const schema = completeReminderSchema(t);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues },
  });

  const handleDeleteConfirm = async () => {
    if (!id) return;
    completeItem(
      {
        reminderId: id,
        actualOdometer: 0, // Replace with actual value
        actualDate: new Date(), // Replace with actual value
      },
      {
        onSuccess: () => {
          setModalVisible(false);
          onConfirm();
          Toast({ text: t("common.deleted") });
        },
      },
    );
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleShow = async () => {
    if (!id) return;
    setModalVisible(true);
  };

  return (
    <>
      <Button
        title="done"
        variant="secondary"
        onPress={handleShow}
        style={styles.doneButton}
      />

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>message</Text>

            <Controller
              control={control}
              name="odometer"
              render={({ field: { value, onChange, onBlur } }) => (
                <>
                  <Input
                    label={t("expenses.odometer")}
                    value={value?.toString() ?? ""}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text === "" ? undefined : Number(text));
                    }}
                    keyboardType="numeric"
                    placeholder={t("expenses.odometerPlaceholder")}
                    style={{ direction: "ltr" }}
                    error={errors?.odometer?.message}
                  />
                </>
              )}
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => {
                  setModalVisible(false);
                }}
                variant="secondary"
                style={{ flex: 1 }}
              />

              <Button
                title="Done"
                onPress={onConfirm}
                variant="danger"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 25,
    fontSize: 16,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    gap: 10,
  },
  doneButton: {
    backgroundColor: Colors.success,
  },
});
