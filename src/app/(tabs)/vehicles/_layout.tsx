import { Stack } from "expo-router";
import { ScreenStyle } from "@/constants";

export default function VehiclesLayout() {
  return (
    <Stack screenOptions={{ ...ScreenStyle }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="form" />
    </Stack>
  );
}
