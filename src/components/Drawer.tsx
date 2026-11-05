import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { CarIcon, HistoryIcon, XIcon } from "lucide-react-native";
import { router } from "expo-router";
import { useTranslation } from "@/languages/useTranslation";
import { CheckUpdate } from "./CheckUpdate";
import { Text } from "./Text";
import { Theme, GlobalStyles } from "@/constants";
import { About } from "./About";
import { ResetAllData } from "./ResetAllData";
import Language from "./Language";
import MenuItem from "./MenuItem";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AppDrawer({ visible, onClose }: Props) {
  const { t, isRTL } = useTranslation();

  const handleShowRecentChanges = () => {
    onClose();
    router.push("/(tabs)/(home)/recent-changes");
  };

  const handleVehicles = () => {
    onClose();
    router.navigate("/vehicles");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[isRTL && GlobalStyles.rtl]}>
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

          <ScrollView
            style={styles.drawerContent}
            showsVerticalScrollIndicator={false}
          >
            <MenuItem
              icon={<CarIcon size={21} color={Theme.primary} />}
              title={t("drawer.vehicles")}
              description={t("drawer.subitemVehicle")}
              onPress={handleVehicles}
            />
            <View style={styles.separator} />
            <About />
            <CheckUpdate />
            <MenuItem
              icon={<HistoryIcon size={21} color={Theme.primary} />}
              title={t("drawer.itemRecentChanges")}
              description={t("drawer.subitemRecentChanges")}
              onPress={handleShowRecentChanges}
            />
            <Language />
            <View style={styles.separator} />
            <ResetAllData onConfirm={() => onClose()} />
            <View style={styles.separator} />
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t("app.madeWithLove")}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  drawer: {
    width: "100%",
    height: "100%",
    backgroundColor: Theme.background,
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
    color: Theme.text,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: Theme.border + 20,
  },
  separator: {
    height: 1,
    backgroundColor: Theme.border + 20,
    marginTop: 5,
    marginBottom: 5,
  },
  drawerContent: {
    flex: 1,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Theme.border + 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 12,
  },
});
