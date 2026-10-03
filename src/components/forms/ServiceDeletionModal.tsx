import { useState } from "react";
import { useDeleteService } from "@/contexts/service-repository";
import { useTranslation } from "@/languages/useTranslation";
import { ConfirmationDialog } from "../ConfirmationDialog";

type Props = {
  editingId: number;
  visible: boolean;
};

export function ServiceDeletionModal({ visible, editingId }: Props) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(visible);

  const { mutate: deleteService } = useDeleteService();

  const handleDeleteConfirm = async () => {
    if (!editingId) return;
    deleteService(editingId, {
      onSuccess: () => {
        setModalVisible(false);
        setModalVisible(false);
      },
    });
  };

  const handleDeleteClose = () => {
    setModalVisible(false);
  };

  return (
    <ConfirmationDialog
      visible={modalVisible}
      onConfirm={handleDeleteConfirm}
      onCancel={handleDeleteClose}
      message={t("services.confirmDelete")}
    />
  );
}
