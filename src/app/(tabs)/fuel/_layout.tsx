import { Stack } from "expo-router";
import { Theme } from "@/constants";
import { useAppFontFamily } from "@/hooks/useAppFontFamily";
import { useTranslation } from "@/languages/useTranslation";

export default function FuelLayout() {
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
          title: t("menus.fuel"),
          headerLargeTitle: true,
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="form"
        options={({ route }: any) => {
          const isEditMode = !!route.params?.id;

          return {
            title: isEditMode ? t("fuel.updateTitle") : t("fuel.createTitle"),
            headerLargeTitle: true,
            headerTitleAlign: "center",
          };
        }}
      />
    </Stack>
  );
}
