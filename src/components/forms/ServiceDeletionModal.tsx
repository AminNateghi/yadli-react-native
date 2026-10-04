import { useState } from "react";
import { useDeleteService } from "@/contexts/service-repository";
import { useTranslation } from "@/languages/useTranslation";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { Button } from "../Button";
import { Toast } from "../CustomToast";

type Props = {
  editingId: number;
  onConfirm: () => void;
};

export function ServiceDeletionModal({ editingId, onConfirm }: Props) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { mutate: deleteService } = useDeleteService();

  const handleDeleteConfirm = async () => {
    if (!editingId) return;
    deleteService(editingId, {
      onSuccess: () => {
        setModalVisible(false);
        onConfirm();
        Toast({ text: t("common.deleted") });
      },
    });
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleDelete = async () => {
    if (!editingId) return;
    setModalVisible(true);
  };

  return (
    <>
      <Button
        title={t("common.delete")}
        variant="danger"
        onPress={handleDelete}
        style={{ flex: 1 }}
      />

      <ConfirmationDialog
        visible={modalVisible}
        onConfirm={handleDeleteConfirm}
        onCancel={handleClose}
        message={t("services.confirmDelete")}
      />
    </>
  );
}
