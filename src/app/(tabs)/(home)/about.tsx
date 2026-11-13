import { useTranslation } from "@/languages/useTranslation";
import { useEffect, useLayoutEffect, useState } from "react";
import Constants from "expo-constants";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "@/components/Text";
import { ShareIcon } from "lucide-react-native";
import { Theme } from "@/constants";
import { Card } from "@/components/Card";
import { convertEnglishNumberToPersian } from "@/utils/number-format";
import { useNavigation } from "expo-router";

export default function AboutScreen() {
  const { t, isRTL } = useTranslation();
  const navigation = useNavigation();

  const [currentVersion, setCurrentVersion] = useState<string>("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("drawer.itemAbout"),
      headerLargeTitle: true,
      headerTitleAlign: "center",
    });
  }, [navigation, t]);

  useEffect(() => {
    setCurrentVersion(Constants.expoConfig?.version ?? "0.0.0");
  }, []);

  const handleMyWebSite = () => {
    Linking.openURL("https://nateghi.xyz/");
  };

  const handleSourceCode = () => {
    Linking.openURL("https://github.com/AminNateghi/yadli-react-native");
  };

  return (
    <ScrollView
      style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.view}>
        <Image
          width={26}
          height={26}
          source={require("./../../../../assets/images/yadli-icon-transparency.png")}
          style={styles.icon}
        />
      </View>

      <Text style={styles.appName}>{t("app.name")}</Text>
      <Text style={styles.title}>{t("app.description")}</Text>
      <Text style={styles.version}>
        {convertEnglishNumberToPersian(currentVersion)}
      </Text>

      <Card style={{ marginTop: 10 }}>
        <Text style={styles.text}>{t("about.description")}</Text>
      </Card>
      <Card style={{ marginTop: 10, paddingTop: 20 }}>
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
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  content: {
    padding: 20,
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
    textAlign: "center",
  },
  link: {
    color: Theme.primary,
  },
  appName: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  text: {
    marginTop: 25,
    marginBottom: 25,
    fontSize: Theme.fontSize,
    textAlign: "center",
  },
  view: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 164,
    height: 164,
  },
});
