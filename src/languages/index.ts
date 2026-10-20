import en from "./i18n/en.json";
import fa from "./i18n/fa.json";
import type { TranslationDictionary } from "./useTranslation";

export const dictionaries = {
  en,
  fa,
} satisfies Record<string, TranslationDictionary>;

export type Locale = keyof typeof dictionaries;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
