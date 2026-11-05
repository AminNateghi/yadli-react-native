import { ScreenStyle } from "@/constants";
import { Stack } from "expo-router";

export default function RemindersLayout() {
  return (
    <Stack screenOptions={{ ...ScreenStyle }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="form" />
    </Stack>
  );
}
