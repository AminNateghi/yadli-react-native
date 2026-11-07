import { router, Tabs, useSegments } from "expo-router";
import {
  BanknoteIcon,
  CarIcon,
  FuelIcon,
  LayoutDashboardIcon,
  TimerIcon,
  WrenchIcon,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppFontFamily } from "@/hooks/useAppFontFamily";
import { useTranslation } from "@/languages/useTranslation";
import { Theme } from "@/constants";

const TAB_BAR_CONTENT_HEIGHT = 60;

export default function TabLayout() {
  const { t, isRTL } = useTranslation();
  const fontFamily = useAppFontFamily();
  const insets = useSafeAreaInsets();

  const segments = useSegments() as string[];
  const isFormScreen =
    segments.includes("form") ||
    segments.includes("onboarding") ||
    segments.includes("recent-changes") ||
    segments.includes("reports");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "fade",
        tabBarActiveTintColor: Theme.primary,
        tabBarInactiveTintColor: Theme.textMuted,
        tabBarStyle: {
          display: isFormScreen ? "none" : "flex", //  Hide dynamically tabs bar in forms/onboarding screen
          backgroundColor: Theme.surface,
          borderTopColor: Theme.borderLight,
          paddingTop: 0,
          paddingBottom: insets.bottom,
          marginBottom: 0,
          height: TAB_BAR_CONTENT_HEIGHT + insets.bottom,
          direction: isRTL ? "rtl" : "ltr",
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 500,
          ...(fontFamily ? { fontFamily } : {}),
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: t("menus.dashboard"),
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboardIcon size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.navigate("/(tabs)/(home)");
          },
        }}
      />

      <Tabs.Screen
        name="services"
        options={{
          title: t("menus.services"),
          tabBarIcon: ({ color, size }) => (
            <WrenchIcon size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.navigate("/(tabs)/services");
          },
        }}
      />

      <Tabs.Screen
        name="fuel"
        options={{
          title: t("menus.fuel"),
          tabBarIcon: ({ color, size }) => (
            <FuelIcon size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.navigate("/(tabs)/fuel");
          },
        }}
      />

      <Tabs.Screen
        name="expenses"
        options={{
          title: t("menus.expenses"),
          tabBarIcon: ({ color, size }) => (
            <BanknoteIcon size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.navigate("/(tabs)/expenses");
          },
        }}
      />

      <Tabs.Screen
        name="reminders"
        options={{
          title: t("menus.reminders"),
          tabBarIcon: ({ color, size }) => (
            <TimerIcon size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.navigate("/(tabs)/reminders");
          },
        }}
      />

      <Tabs.Screen
        name="vehicles"
        options={{
          title: t("menus.vehicles"),
          tabBarIcon: ({ color, size }) => (
            <CarIcon size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
