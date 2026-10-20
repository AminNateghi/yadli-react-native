import { useEffect, useState } from "react";
import { useGetProfile } from "@/repositories/profile-repository";
import langEn from "./i18n/en.json";
import langFa from "./i18n/fa.json";
import type { LanguageType } from "@/types/interfaces";

export type TranslationDictionary = typeof langEn;

type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends object
      ? `${K}.${NestedKeyOf<T[K]>}`
      : never;
}[keyof T & string];

export type TranslationKey = NestedKeyOf<TranslationDictionary>;

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

export const useTranslation = () => {
  const { data } = useGetProfile();
  const [language, setLanguage] = useState<LanguageType>("fa");

  useEffect(() => {
    if (data) {
      setLanguage(data.language ?? "fa");
    }
  }, [data]);

  const dict: TranslationProps = translationDictionaries[language];

  const t = (key: TranslationKey): string => {
    return getNestedValue(dict, key) ?? key;
  };

  // dynamic string keys
  const tString = (key: string): string => {
    return getNestedValue(dict, key) ?? key;
  };

  const isRTL = t("app.rtl") === "true";

  return { t, tString, isRTL };
};
