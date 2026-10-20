import { useState } from "react";
import { Linking, Modal, StyleSheet, View } from "react-native";
import { GlobalStyles } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { Button } from "./Button";
import { Card } from "./Card";
import { Text } from "./Text";
import Constants from "expo-constants";

export function CheckUpdate() {
  const { t, isRTL } = useTranslation();
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
    <View style={[styles.content, isRTL && GlobalStyles.rtl]}>
      <Card style={{ paddingBottom: 12 }}>
        <Text>{t("checkUpdate.title")}</Text>
        <Button
          title={t("checkUpdate.checkForUpdate")}
          variant="subtle"
          onPress={handleShow}
        />
      </Card>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
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
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 16,
  },
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
