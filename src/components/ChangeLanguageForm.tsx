import { useEffect, useState } from "react";
import { View } from "react-native";
import { GlobalStyles } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { LANGUAGE_TYPE, type LanguageType } from "@/types/interfaces";
import { SelectPicker } from "./SelectPicker";
import {
  useGetProfile,
  useSaveProfileLanguage,
} from "@/repositories/profile-repository";
import { useRouter } from "expo-router";
import { Card } from "./Card";

export function ChangeLanguageForm() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const [language, setLanguage] = useState<LanguageType>("fa");

  const { data } = useGetProfile();
  const { mutate: saveLanguage } = useSaveProfileLanguage();

  useEffect(() => {
    if (data) {
      setLanguage(data.language ?? "fa");
    }
  }, [data]);

  return (
    <View style={[isRTL && GlobalStyles.rtl]}>
      <Card>
        <SelectPicker
          label={t("settings.language")}
          value={language}
          options={LANGUAGE_TYPE}
          onValueChange={(value) => {
            saveLanguage(value as LanguageType);
            router.back();
          }}
        />
      </Card>
    </View>
  );
}
