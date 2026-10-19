import { useState } from "react";
import { useTranslation } from "@/languages/useTranslation";
import { Button } from "../Button";
import { useDeleteReminder } from "@/repositories/reminder-repository";
import { ConfirmationDialog } from "../ConfirmationDialog";

type Props = {
  id: number;
  onConfirm: () => void;
};

export function CompleteReminderOneTimeModal({ id, onConfirm }: Props) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { mutate: completeItem } = useDeleteReminder();

  const handleConfirm = async () => {
    if (!id) return;
    completeItem(id, {
      onSuccess: () => {
        setModalVisible(false);
        onConfirm();
      },
    });
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
        title={`${t("common.done")}...`}
        variant="solid"
        color="green"
        onPress={handleShow}
        style={{ flex: 1 }}
      />

      <ConfirmationDialog
        visible={modalVisible}
        onConfirm={handleConfirm}
        onCancel={handleClose}
        message={t("reminders.doneOneTimeMessage")}
      />
    </>
  );
}
