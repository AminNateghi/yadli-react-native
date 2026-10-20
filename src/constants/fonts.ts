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
