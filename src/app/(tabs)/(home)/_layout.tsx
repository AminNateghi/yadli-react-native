import { Stack } from "expo-router";
import { ScreenStyle } from "@/constants";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ ...ScreenStyle }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="recent-changes" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
