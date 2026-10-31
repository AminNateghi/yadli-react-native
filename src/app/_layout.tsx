import { QueryClientProvider } from "@tanstack/react-query";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { Text } from "@/components/Text";
import { queryClient } from "@/utils/query-client";
import { db } from "@/db";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";
import migrations from "@/db/migrations/migrations";
import { UpdateCheckProvider } from "@/contexts/UpdateCheckContext";

SplashScreen.preventAutoHideAsync();

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

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

  useEffect(() => {
    if (!loaded || !success || Platform.OS === "web") return;

    let lastHandledResponse: string | null = null;
    const handleNotificationResponse = (
      response: Notifications.NotificationResponse,
    ) => {
      const { notification, actionIdentifier } = response;
      const reminderId = Number(notification.request.content.data?.reminderId);
      if (!Number.isInteger(reminderId) || reminderId <= 0) return;

      const responseId = `${notification.request.identifier}:${actionIdentifier}`;
      if (lastHandledResponse === responseId) return;
      lastHandledResponse = responseId;

      router.push({
        pathname: "/reminders/form",
        params: { id: String(reminderId) },
      });
      Notifications.clearLastNotificationResponse();
    };

    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse) {
      handleNotificationResponse(lastResponse);
    }

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse,
      );
    return () => responseSubscription.remove();
  }, [loaded, success]);

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
    <KeyboardProvider>
      <SafeAreaProvider style={{ flex: 1 }}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <QueryClientProvider client={queryClient}>
            <UpdateCheckProvider>
              <Stack screenOptions={{ headerShown: false }} />
              <StatusBar style="auto" animated />
            </UpdateCheckProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </KeyboardProvider>
  );
}
