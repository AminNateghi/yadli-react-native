import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { CheckIcon, Languages } from "lucide-react-native";
import { LANGUAGE_TYPE, type LanguageType } from "@/types/interfaces";
import {
  useGetProfile,
  useSaveProfileLanguage,
} from "@/repositories/profile-repository";
import { useTranslation } from "@/languages/useTranslation";
import { Text } from "./Text";
import { Theme } from "@/constants";
import MenuItem from "./MenuItem";
import Modal from "./Modal";

export default function Language() {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentLanguage, setLanguage] = useState<LanguageType>("fa");

  const { data } = useGetProfile();
  const { mutate: saveLanguage } = useSaveProfileLanguage();

  useEffect(() => {
    if (data) {
      setLanguage(data.language ?? "fa");
    }
  }, [data]);

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleSave = (value: LanguageType) => {
    saveLanguage(value);
    handleClose();
  };

  return (
    <>
      <MenuItem
        icon={<Languages size={21} color={Theme.primary} />}
        title={t("drawer.itemLanguage")}
        description={t("drawer.subitemLanguage")}
        onPress={() => setModalVisible(true)}
      />

      <Modal
        title={t("common.chooseLanguage")}
        visible={modalVisible}
        onClose={handleClose}
      >
        {LANGUAGE_TYPE.map((language) => (
          <Pressable
            key={language.value}
            style={[
              styles.languageRow,
              language.value === currentLanguage && styles.optionSelected,
            ]}
            onPress={() => handleSave(language.value)}
            accessibilityRole="radio"
            accessibilityState={{
              checked: currentLanguage === language.value,
            }}
          >
            <Text>{language.label}</Text>
            {currentLanguage === language.value && (
              <CheckIcon size={20} color={Theme.primary} />
            )}
          </Pressable>
        ))}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderLight,
  },
  optionSelected: {
    backgroundColor: Theme.primary + 10,
  },
});
