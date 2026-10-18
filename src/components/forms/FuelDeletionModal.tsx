import { useState } from "react";
import { useTranslation } from "@/languages/useTranslation";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { Button } from "../Button";
import { Toast } from "../CustomToast";
import { useDeleteFuel } from "@/repositories/fuel-repository";

type Props = {
  editingId: number | null;
  onConfirm: () => void;
};

export function FuelDeletionModal({ editingId, onConfirm }: Props) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { mutate: deleteItem } = useDeleteFuel();

  const handleDeleteConfirm = async () => {
    if (!editingId) return;
    deleteItem(editingId, {
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
        variant="outline"
        color="red"
        onPress={handleDelete}
        style={{ flex: 1 }}
      />

      <ConfirmationDialog
        visible={modalVisible}
        onConfirm={handleDeleteConfirm}
        onCancel={handleClose}
        message={t("fuel.confirmDelete")}
      />
    </>
  );
}
