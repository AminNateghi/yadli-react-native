import { Fonts } from "./fonts";

export const Theme = {
  primary: "#007AFF",
  primaryDark: "#1D4ED8",
  secondary: "#64748B",
  transparent: "transparent",

  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#007AFF",

  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F5F9",

  text: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#898d92",

  border: "#b1b1b1",
  borderLight: "#F1F5F9",

  violet: "#8B5CF6",
  gray: "#1f1f21",
  blue: "#007AFF",
  green: "#16a34a",

  strongAmbZer: "#F59E0B",
  orange: "#ea580c",
  red: "#dc2626",
  mulberry: "#8d0d49",

  borderRadius: 12,
  height: 50,
  fontSize: 16,
};

export const Palette = {
  gray: Theme.gray,
  blue: Theme.blue,
  green: Theme.green,
  orange: Theme.orange,
  red: Theme.red,
};

export const ScreenStyle = {
  headerStyle: { backgroundColor: Theme.background },
  headerShadowVisible: false,
  headerTintColor: Theme.text,
  contentStyle: { backgroundColor: Theme.background },
  headerTitleStyle: { fontFamily: Fonts.vazirRegular },
};
