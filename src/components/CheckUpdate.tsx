import { useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { useTranslation } from "@/languages/useTranslation";
import { Button } from "./Button";
import { Text } from "./Text";
import { RocketIcon } from "lucide-react-native";
import Constants from "expo-constants";
import MenuItem from "./MenuItem";
import Modal from "./Modal";
import { Theme } from "@/constants";

export function CheckUpdate() {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  const handleConfirm = async () => {
    Linking.openURL(downloadUrl);
  };

  function compareVersions(a: string, b: string) {
    const parse = (v: string) => v.split(".").map((part) => Number(part));

    const va = parse(a);
    const vb = parse(b);

    for (let i = 0; i < Math.max(va.length, vb.length); i++) {
      const difference = (va[i] ?? 0) - (vb[i] ?? 0);

      if (difference !== 0) {
        return difference > 0 ? 1 : -1;
      }
    }

    return 0;
  }

  const handleShow = async () => {
    setModalVisible(true);
    setUpdateAvailable(false);
    setMessage(t("checkUpdate.loading"));

    const response = await fetch(
      `https://api.github.com/repos/AminNateghi/yadli-react-native/releases/latest`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      },
    );

    if (!response.ok) {
      setMessage(t("checkUpdate.error"));
    }

    const release = await response.json();

    // Ignore draft releases and prereleases
    if (release.draft || release.prerelease) {
      return null;
    }

    const latestVersion = release.tag_name.replace(/^v/, "");
    const currentVersion = Constants.expoConfig?.version ?? "0.0.0";
    const isNewVersion = compareVersions(latestVersion, currentVersion) > 0;

    const apk = release.assets.find((asset: { name: string }) =>
      asset.name.toLowerCase().endsWith(".apk"),
    );

    if (!apk?.browser_download_url) {
      setMessage(t("checkUpdate.error"));
      setUpdateAvailable(false);
      return;
    }

    if (!isNewVersion) {
      setMessage(t("checkUpdate.noUpdateAvailable"));
      setUpdateAvailable(false);
      return;
    }

    setDownloadUrl(apk?.browser_download_url);
    setMessage(t("checkUpdate.updateAvailable"));
    setUpdateAvailable(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      <MenuItem
        icon={<RocketIcon size={21} color={Theme.warning} />}
        title={t("drawer.itemUpdate")}
        description={t("drawer.subitemUpdate")}
        onPress={handleShow}
      />

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
    </>
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
});
