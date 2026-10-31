import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Theme } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { Button } from "./Button";
import { useResetAllData } from "@/repositories/profile-repository";
import { useRouter } from "expo-router";
import { Text } from "./Text";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { Toast } from "./CustomToast";
import { TrashIcon } from "lucide-react-native";
import MenuItem from "./MenuItem";
import Modal from "./Modal";

export function ResetAllData() {
  const { t } = useTranslation();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);

  const { mutate: resetData } = useResetAllData();

  const handleConfirm = () => {
    resetData(undefined, {
      onSuccess: () => {
        setConfirmVisible(false);
        Toast({ text: t("common.deleted") });
      },
      onError: () => {
        Toast({ text: t("reminders.notificationError"), type: "error" });
      },
    });
    router.back();
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleShowConfirm = async () => {
    setConfirmVisible(true);
  };

  const handleCloseConfirm = () => {
    setConfirmVisible(false);
    setModalVisible(false);
  };

  return (
    <>
      <MenuItem
        icon={<TrashIcon size={21} color={Theme.danger} />}
        title={t("drawer.itemResetAllData")}
        description={t("drawer.subitemResetAllData")}
        onPress={() => setModalVisible(true)}
      />

      <Modal
        title={t("resetData.title")}
        visible={modalVisible}
        onClose={handleClose}
      >
        <View style={styles.content}>
          <Text>{t("resetData.description")}</Text>
          <Button
            title={t("resetData.resetButton")}
            variant="subtle"
            color="red"
            onPress={handleShowConfirm}
          />

          <ConfirmationDialog
            visible={confirmVisible}
            onConfirm={handleConfirm}
            onCancel={handleCloseConfirm}
            message={t("resetData.confirmMessage")}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
});
