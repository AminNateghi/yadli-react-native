import { router, Stack } from "expo-router";
import { Colors } from "@/constants/theme";
import { useAppFontFamily } from "@/hooks/useAppFontFamily";
import { useTranslation } from "@/languages/useTranslation";
import { IconButton } from "@/components/IconButton";
import { PlusIcon } from "lucide-react-native";

export default function FuelLayout() {
  const { t, isRTL } = useTranslation();
  const fontFamily = useAppFontFamily();

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
          title: t("menus.fuel"),
          headerLargeTitle: true,
          headerTitleAlign: "center",
          headerLeft: () =>
            isRTL ? (
              <></>
            ) : (
              <IconButton
                icon={PlusIcon}
                variant="bordered"
                onPress={() => router.push("/fuel/form")}
              />
            ),
          headerRight: () =>
            isRTL ? (
              <IconButton
                icon={PlusIcon}
                variant="bordered"
                onPress={() => router.push("/fuel/form")}
              />
            ) : (
              <></>
            ),
        }}
      />

      <Stack.Screen
        name="form"
        options={{
          title: t("menus.fuel"),
          headerLargeTitle: true,
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
