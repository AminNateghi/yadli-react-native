import { router, Stack } from "expo-router";
import { Colors } from "@/constants";
import { useAppFontFamily } from "@/hooks/useAppFontFamily";
import { useTranslation } from "@/languages/useTranslation";
import { IconButton } from "@/components/IconButton";
import { MenuIcon } from "lucide-react-native";

export default function HomeLayout() {
  const { t, isRTL } = useTranslation();
  const fontFamily = useAppFontFamily();

  const handleGotoMenu = () => {
    router.push("/drawer");
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerShadowVisible: false,
        headerTintColor: Colors.text,
        contentStyle: { backgroundColor: Colors.background },
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
              <IconButton icon={MenuIcon} onPress={() => handleGotoMenu()} />
            ),
          headerRight: () =>
            isRTL ? (
              <IconButton icon={MenuIcon} onPress={() => handleGotoMenu()} />
            ) : (
              <></>
            ),
        }}
      />

      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
