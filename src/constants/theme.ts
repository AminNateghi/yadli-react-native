import { StyleSheet } from "react-native";
import type { LanguageType } from "@/types/interfaces";

export const Fonts = {
  vazirRegular: "VazirRegular",
  vazirBold: "VazirBold",
} as const;

export const isBoldFontWeight = (fontWeight: unknown): boolean => {
  if (fontWeight === "bold") return true;
  if (typeof fontWeight === "number") return fontWeight >= 600;
  if (typeof fontWeight === "string") {
    const parsed = Number.parseInt(fontWeight, 10);
    return fontWeight === "bold" || (!Number.isNaN(parsed) && parsed >= 600);
  }
  return false;
};

export const getAppFontFamily = (
  language: LanguageType,
  fontWeight?: unknown,
): string | undefined => {
  if (language !== "fa") return undefined;
  return isBoldFontWeight(fontWeight) ? Fonts.vazirBold : Fonts.vazirRegular;
};

export const Colors = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  secondary: "#64748B",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",

  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F5F9",

  text: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#898d92",

  border: "#b1b1b1",
  borderLight: "#F1F5F9",

  fuel: "#F59E0B",
  service: "#10B981",
  expense: "#8B5CF6",
};

export const globalStyles = StyleSheet.create({
  rtl: {
    direction: "rtl",
  },
  fabContainer: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  fabContainerRTL: {
    position: "absolute",
    left: 16,
    bottom: 16,
  },
  fabContainerDesktop: {
    right: 32,
    bottom: 32,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.service,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPressed: {
    opacity: 0.8,
  },

  error: {
    color: Colors.danger,
    fontSize: 10,
  },
});
