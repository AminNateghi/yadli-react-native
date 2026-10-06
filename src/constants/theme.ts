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

  // fab button
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
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    backgroundColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPressed: {
    opacity: 0.8,
  },
  fabService: {
    backgroundColor: Colors.service,
  },
  fabFuel: {
    backgroundColor: Colors.fuel,
  },
  fabExpense: {
    backgroundColor: Colors.expense,
  },

  // modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalContentDesktop: {
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
    borderRadius: 24,
    marginBottom: 40,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
  },
  modalScroll: {
    padding: 20,
  },
  modalButtonRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
  },

  // summery card
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 4,
  },
});
