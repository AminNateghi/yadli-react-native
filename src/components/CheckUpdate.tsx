import { useState } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "@/languages/useTranslation";
import { Button } from "./Button";
import { Text } from "./Text";
import { RocketIcon } from "lucide-react-native";
import { GlobalStyles, Theme } from "@/constants";
import { useUpdateCheck } from "@/contexts/UpdateCheckContext";
import MenuItem from "./MenuItem";
import Modal from "./Modal";

interface Props {
  type?: "icon" | "menu-item";
}

export function CheckUpdate({ type = "menu-item" }: Props) {
  const { t, isRTL } = useTranslation();
  const { checkNow } = useUpdateCheck();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  const handleConfirm = async () => {
    await Linking.openURL(downloadUrl);
  };

  const handleShow = async () => {
    setModalVisible(true);
    setUpdateAvailable(false);
    setMessage(t("checkUpdate.loading"));

    try {
      const result = await checkNow();
      if (!result.available) {
        setMessage(t("checkUpdate.noUpdateAvailable"));
        setUpdateAvailable(false);
        return;
      }

      setDownloadUrl(result.downloadUrl);
      setMessage(t("checkUpdate.updateAvailable"));
      setUpdateAvailable(true);
    } catch (error) {
      console.error("Manual update check failed:", error);
      setMessage(t("checkUpdate.error"));
      setUpdateAvailable(false);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={[isRTL && GlobalStyles.rtl]}>
      {type === "menu-item" && (
        <MenuItem
          icon={<RocketIcon size={21} color={Theme.warning} />}
          title={t("drawer.itemUpdate")}
          description={t("drawer.subitemUpdate")}
          onPress={handleShow}
        />
      )}
      {type === "icon" && (
        <Pressable onPress={handleShow}>
          <View style={styles.updateButton}>
            {isRTL ? (
              <RocketIcon size={14} color={Theme.warning} />
            ) : (
              <RocketIcon size={14} color={Theme.warning} />
            )}
            <Text style={styles.updateCaption}>
              {t("checkUpdate.newVersion")}
            </Text>
          </View>
        </Pressable>
      )}

      <Modal
        title={t("checkUpdate.title")}
        visible={modalVisible}
        onClose={handleClose}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.buttonContainer}>
            <Button
              title={t("common.close")}
              onPress={handleClose}
              variant="outline"
              color="gray"
            />

            <Button
              title={t("checkUpdate.buttonDownload")}
              onPress={handleConfirm}
              variant={updateAvailable ? "solid" : "outline"}
              color="blue"
              disabled={!updateAvailable}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalView: {
    padding: 20,
    paddingBottom: 0,
  },
  modalText: {
    marginBottom: 25,
    fontSize: Theme.fontSize,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    gap: 10,
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Theme.warning + 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  updateCaption: {
    fontSize: 11,
    fontWeight: 600,
    color: Theme.warning,
  },
});
