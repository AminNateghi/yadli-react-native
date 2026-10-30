import { useState } from "react";
import { Stack } from "expo-router";
import { Theme } from "@/constants";
import { useAppFontFamily } from "@/hooks/useAppFontFamily";
import { useTranslation } from "@/languages/useTranslation";
import { IconButton } from "@/components/IconButton";
import { MenuIcon } from "lucide-react-native";
import AppDrawer from "@/components/Drawer";

export default function HomeLayout() {
  const { t, isRTL } = useTranslation();
  const fontFamily = useAppFontFamily();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleShowDrawer = () => {
    setDrawerVisible(true);
  };

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Theme.background },
          headerShadowVisible: false,
          headerTintColor: Theme.text,
          contentStyle: { backgroundColor: Theme.background },
          headerTitleStyle: { ...(fontFamily ? { fontFamily } : {}) },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: t("menus.dashboard"),
            headerTitleAlign: "center",
            headerLargeTitle: true,
            headerLeft: () =>
              isRTL ? (
                <></>
              ) : (
                <IconButton
                  icon={MenuIcon}
                  onPress={() => handleShowDrawer()}
                />
              ),
            headerRight: () =>
              isRTL ? (
                <IconButton
                  icon={MenuIcon}
                  onPress={() => handleShowDrawer()}
                />
              ) : (
                <></>
              ),
          }}
        />

        <Stack.Screen
          name="reports"
          options={{
            title: t("reports.title"),
            headerLargeTitle: true,
            headerTitleAlign: "center",
          }}
        />

        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <AppDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </>
  );
}
