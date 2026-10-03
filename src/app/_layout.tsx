import { QueryClientProvider } from "@tanstack/react-query";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Text } from "@/components/Text";
import { queryClient } from "@/contexts/query-client";
import { db } from "@/db";
import migrations from "@/db/migrations/migrations";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTranslation } from "@/languages/useTranslation";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isRTL } = useTranslation();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const { success, error } = useMigrations(db, migrations);

  const [loaded] = useFonts({
    VazirRegular: require("@/assets/fonts/Vazirmatn-Regular.ttf"),
    VazirBold: require("@/assets/fonts/Vazirmatn-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider style={{ marginBottom: insets.bottom }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" animated />
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
