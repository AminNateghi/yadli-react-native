import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { GlobalStyles } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { Button } from "./Button";
import { useResetAllData } from "@/repositories/profile-repository";
import { useRouter } from "expo-router";
import { Card } from "./Card";
import { Text } from "./Text";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { Toast } from "./CustomToast";

export function ResetAllData() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { mutate: resetData } = useResetAllData();

  const handleConfirm = () => {
    resetData(undefined, {
      onSuccess: () => {
        setModalVisible(false);
        Toast({ text: t("common.deleted") });
      },
    });
    router.back();
  };

  const handleShow = async () => {
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={[styles.content, isRTL && GlobalStyles.rtl]}>
      <Card style={{ paddingBottom: 12 }}>
        <Text>{t("resetData.title")}</Text>
        <Button
          title={t("resetData.resetButton")}
          variant="subtle"
          color="red"
          onPress={handleShow}
        />
      </Card>

      <ConfirmationDialog
        visible={modalVisible}
        onConfirm={handleConfirm}
        onCancel={handleClose}
        message={t("resetData.confirmMessage")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 16,
  },
});
