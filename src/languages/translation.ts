import langEn from "./i18n/en.json";
import langFa from "./i18n/fa.json";
import type { LanguageType } from "@/types/interfaces";

export type TranslationDictionary = typeof langEn;

export type TranslationKey = {
  [K in keyof TranslationDictionary &
    string]: TranslationDictionary[K] extends string
    ? K
    : TranslationDictionary[K] extends object
      ? `${K}.${TranslationKeyOf<TranslationDictionary[K]>}`
      : never;
}[keyof TranslationDictionary & string];

type TranslationKeyOf<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends object
      ? `${K}.${TranslationKeyOf<T[K]>}`
      : never;
}[keyof T & string];

type TranslationProps = {
  [key: string]: string | TranslationProps;
};

const translationDictionaries = {
  en: langEn,
  fa: langFa,
} satisfies Record<LanguageType, TranslationDictionary>;

const getNestedValue = (
  obj: TranslationProps,
  key: string,
): string | undefined => {
  const result = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }

    return undefined;
  }, obj);

  return typeof result === "string" ? result : undefined;
};

export const getTranslation = (
  language: LanguageType,
  key: TranslationKey,
): string => {
  const dict: TranslationProps = translationDictionaries[language];
  return getNestedValue(dict, key) ?? key;
};

export const getTranslationString = (
  language: LanguageType,
  key: string,
): string => {
  const dict: TranslationProps = translationDictionaries[language];
  return getNestedValue(dict, key) ?? key;
};
