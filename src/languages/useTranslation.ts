import { useEffect, useState } from "react";
import { useGetProfile } from "@/repositories/profile-repository";
import type { LanguageType } from "@/types/interfaces";
import {
  getTranslation,
  getTranslationString,
  type TranslationKey,
} from "./translation";

export type { TranslationDictionary, TranslationKey } from "./translation";
export { getTranslation } from "./translation";

export const useTranslation = () => {
  const { data } = useGetProfile();
  const [language, setLanguage] = useState<LanguageType>("fa");

  useEffect(() => {
    if (data) {
      setLanguage(data.language ?? "fa");
    }
  }, [data]);

  const t = (key: TranslationKey): string => {
    return getTranslation(language, key);
  };

  // dynamic string keys
  const tString = (key: string): string => {
    return getTranslationString(language, key);
  };

  const isRTL = t("app.rtl") === "true";

  return { t, tString, isRTL };
};
