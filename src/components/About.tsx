import { useState } from "react";
import { Image, Linking, Pressable, StyleSheet, View } from "react-native";
import { Theme } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { Button } from "./Button";
import { Text } from "./Text";
import Constants from "expo-constants";
import { BoxIcon, ShareIcon } from "lucide-react-native";
import Modal from "./Modal";
import MenuItem from "./MenuItem";

export function About() {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentVersion, setCurrentVersion] = useState<string>("");

  const handleShow = async () => {
    setModalVisible(true);
    setCurrentVersion(Constants.expoConfig?.version ?? "0.0.0");
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleMyWebSite = () => {
    Linking.openURL("https://nateghi.xyz/");
  };

  const handleSourceCode = () => {
    Linking.openURL("https://github.com/AminNateghi/yadli-react-native");
  };

  return (
    <>
      <MenuItem
        icon={<BoxIcon size={21} color={Theme.success} />}
        title={t("drawer.itemAbout")}
        description={t("drawer.subitemAbout")}
        onPress={handleShow}
      />

      <Modal visible={modalVisible} onClose={handleClose}>
        <View style={styles.modalView}>
          <View>
            <Image
              width={26}
              height={26}
              source={require("./../../assets/images/yadli-icon.png")}
              style={styles.icon}
            />
          </View>
          <Text style={styles.appName}>{t("app.name")}</Text>
          <Text style={styles.modalTitle}>{t("app.description")}</Text>
          <Text style={styles.version}>{currentVersion}</Text>
          <Text style={styles.modalText}>{t("about.description")}</Text>
          <View style={styles.developerContent}>
            <Text>{t("about.developedBy")}</Text>
            <Pressable onPress={handleMyWebSite}>
              <Text style={styles.link}>
                {t("about.developerName")}
                <ShareIcon color={Theme.primary} size={14} />
              </Text>
            </Pressable>
          </View>
          <View style={styles.developerContent}>
            <Text>{t("about.sourceOn")}</Text>
            <Pressable onPress={handleSourceCode}>
              <Text style={styles.link}>
                {t("about.github")}
                <ShareIcon color={Theme.primary} size={14} />
              </Text>
            </Pressable>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={t("common.close")}
              onPress={handleClose}
              variant="outline"
              color="gray"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  developerContent: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
    alignItems: "baseline",
    justifyContent: "center",
  },
  version: {
    fontSize: 14,
  },
  link: {
    color: Theme.primary,
  },
  modalView: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalText: {
    marginTop: 25,
    marginBottom: 25,
    fontSize: Theme.fontSize,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
  icon: { width: 64, height: 64, borderRadius: 8, marginBottom: 10 },
});
