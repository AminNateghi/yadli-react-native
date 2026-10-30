import { Stack } from "expo-router";
import { Theme } from "@/constants";
import { useAppFontFamily } from "@/hooks/useAppFontFamily";
import { useTranslation } from "@/languages/useTranslation";

export default function ServicesLayout() {
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
          title: t("menus.services"),
          headerLargeTitle: false,
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="form"
        options={({ route }: any) => {
          const isEditMode = !!route.params?.id;

          return {
            title: isEditMode
              ? t("services.updateTitle")
              : t("services.createTitle"),
            headerLargeTitle: true,
            headerTitleAlign: "center",
          };
        }}
      />
    </Stack>
  );
}
