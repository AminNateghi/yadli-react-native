import { useState } from "react";
import {
  Image,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Colors, GlobalStyles } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { Button } from "./Button";
import { Card } from "./Card";
import { Text } from "./Text";
import Constants from "expo-constants";
import { ShareIcon } from "lucide-react-native";

export function About() {
  const { t, isRTL } = useTranslation();
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

  return (
    <View style={[styles.content, isRTL && GlobalStyles.rtl]}>
      <Card style={{ paddingBottom: 12 }}>
        <Text>{t("about.buttonInfo")}</Text>
        <Button
          title={t("about.buttonCaption")}
          variant="subtle"
          color="gray"
          onPress={handleShow}
        />
      </Card>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <Image
                width={26}
                height={26}
                source={require("./../../assets/images/yadli-icon.png")}
                style={styles.icon}
              />
            </View>
            <Text style={styles.modalTitle}>{t("about.title")}</Text>
            <Text style={styles.version}>{currentVersion}</Text>
            <Text style={styles.modalText}>{t("about.description")}</Text>
            <View style={styles.developerContent}>
              <Text>{t("about.developedBy")}</Text>
              <Pressable onPress={handleMyWebSite}>
                <Text style={styles.link}>
                  {t("about.developerName")}
                  <ShareIcon color={Colors.primary} size={14} />
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
    color: Colors.primary,
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalText: {
    marginTop: 25,
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
  icon: { width: 64, height: 64, borderRadius: 8, marginBottom: 10 },
});
