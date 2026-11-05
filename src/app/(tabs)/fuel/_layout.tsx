import { Stack } from "expo-router";
import { ScreenStyle } from "@/constants";

export default function FuelLayout() {
  return (
    <Stack screenOptions={{ ...ScreenStyle }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="form" />
    </Stack>
  );
}
