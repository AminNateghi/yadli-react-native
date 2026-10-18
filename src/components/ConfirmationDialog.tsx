import { Text } from "@/components/Text";
import { useTranslation } from "@/languages/useTranslation";
import { Modal, StyleSheet, View } from "react-native";
import { Button } from "./Button";

type ConfirmationDialogProps = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "YesNo" | "Ok";
};

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  onConfirm,
  onCancel,
  message,
  confirmText,
  cancelText,
  type = "YesNo",
}) => {
  const { t } = useTranslation();
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.buttonContainer}>
            <Button
              title={
                (cancelText ?? type === "Ok") ? t("common.ok") : t("common.no")
              }
              onPress={onCancel}
              variant="outline"
              color="gray"
              style={{ flex: 1 }}
            />
            {type !== "Ok" && (
              <Button
                title={confirmText ?? t("common.yes")}
                onPress={onConfirm}
                variant="outline"
                color="red"
                style={{ flex: 1 }}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
});
