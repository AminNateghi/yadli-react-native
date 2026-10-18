import { IconButton } from "@/components/IconButton";
import { Colors } from "@/constants/theme";
import { useAppFontFamily } from "@/hooks/useAppFontFamily";
import { useTranslation } from "@/languages/useTranslation";
import { router, Stack } from "expo-router";
import { PlusIcon } from "lucide-react-native";

export default function ServicesLayout() {
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
          title: t("menus.reminders"),
          headerLargeTitle: true,
          headerTitleAlign: "center",
          headerLeft: () =>
            isRTL ? (
              <></>
            ) : (
              <IconButton
                icon={PlusIcon}
                variant="bordered"
                onPress={() => router.push("/reminders/form")}
              />
            ),
          headerRight: () =>
            isRTL ? (
              <IconButton
                icon={PlusIcon}
                variant="bordered"
                onPress={() => router.push("/reminders/form")}
              />
            ) : (
              <></>
            ),
        }}
      />

      <Stack.Screen
        name="form"
        options={({ route }: any) => {
          const isEditMode = !!route.params?.id;

          return {
            title: isEditMode
              ? t("reminders.updateTitle")
              : t("reminders.createTitle"),
            headerLargeTitle: true,
            headerTitleAlign: "center",
          };
        }}
      />
    </Stack>
  );
}
