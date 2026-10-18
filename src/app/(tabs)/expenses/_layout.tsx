import { IconButton } from "@/components/IconButton";
import { Colors } from "@/constants/theme";
import { useAppFontFamily } from "@/hooks/useAppFontFamily";
import { useTranslation } from "@/languages/useTranslation";
import { Stack, useRouter } from "expo-router";
import { PlusIcon } from "lucide-react-native";

export default function ExpensesLayout() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();
  const fontFamily = useAppFontFamily();

  return (
    <Stack
      screenOptions={{
        animation: "fade_from_bottom",
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
          title: t("menus.expenses"),
          headerLargeTitle: true,
          headerTitleAlign: "center",
          headerLeft: () =>
            isRTL ? (
              <></>
            ) : (
              <IconButton
                icon={PlusIcon}
                variant="bordered"
                onPress={() => router.push("/expenses/form")}
              />
            ),
          headerRight: () =>
            isRTL ? (
              <IconButton
                icon={PlusIcon}
                variant="bordered"
                onPress={() => router.push("/expenses/form")}
              />
            ) : (
              <></>
            ),
        }}
      />
      <Stack.Screen
        name="form"
        options={{
          title: t("menus.expenses"),
          headerLargeTitle: true,
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
