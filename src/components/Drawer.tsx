import { Modal, Pressable, StyleSheet, View } from "react-native";
import { XIcon } from "lucide-react-native";
import { useTranslation } from "@/languages/useTranslation";
import { CheckUpdate } from "./CheckUpdate";
import { Text } from "./Text";
import { Colors, GlobalStyles } from "@/constants";
import { About } from "./About";
import Language from "./Language";
import { ResetAllData } from "./ResetAllData";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AppDrawer({ visible, onClose }: Props) {
  const { t, isRTL } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.overlay, isRTL && GlobalStyles.rtl]}>
        <Pressable
          onPress={onClose}
          accessibilityLabel={t("drawer.closeDrawer")}
        />

        <View style={styles.drawer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.appName}>{t("app.name")}</Text>
              <Text style={styles.subtitle}>{t("app.description")}</Text>
            </View>

            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel={t("drawer.closeDrawer")}
              accessibilityRole="button"
            >
              <XIcon size={22} />
            </Pressable>
          </View>

          <View style={styles.separator} />

          <Language />
          <About />
          <CheckUpdate />
          <ResetAllData />

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t("app.madeWithLove")}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  drawer: {
    width: "82%",
    maxWidth: 340,
    height: "100%",
    backgroundColor: Colors.background,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 22,
  },
  appName: {
    fontSize: 25,
    fontWeight: "700",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: Colors.border + 20,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border + 20,
    marginBottom: 24,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border + 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 12,
  },
});
