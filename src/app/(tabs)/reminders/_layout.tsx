import { Theme } from "@/constants";
import { useAppFontFamily } from "@/hooks/useAppFontFamily";
import { useTranslation } from "@/languages/useTranslation";
import { Stack } from "expo-router";

export default function RemindersLayout() {
  const { t } = useTranslation();
  const fontFamily = useAppFontFamily();

  return (
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
          title: t("menus.reminders"),
          headerLargeTitle: true,
          headerTitleAlign: "center",
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
