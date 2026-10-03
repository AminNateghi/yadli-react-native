import { MenuIcon, XIcon } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useMediaQuery } from "react-responsive";
import { Text } from "@/components/Text";
import { Colors, rtlStyles } from "@/constants/theme";
import { useTranslation } from "@/languages/useTranslation";
import { LANGUAGE_TYPE, LanguageType } from "@/types/interfaces";
import { Button } from "./Button";
import { SelectPicker } from "./SelectPicker";

export function SettingsModal() {
  // const { t, isRTL } = useTranslation();
  // const { language: storageLanguage, updateLanguage } = useData();
  // const [modalVisible, setModalVisible] = useState(false);
  // const [saving, setSaving] = useState(false);
  // const [language, setLanguage] = useState<LanguageType>(storageLanguage);
  // const isDesktop = useMediaQuery({ minWidth: 768 });

  // const handleSave = () => {
  //   setSaving(true);
  //   updateLanguage(language);
  //   setSaving(false);
  //   setModalVisible(false);
  // };

  // return (
  //   <View style={[isRTL && rtlStyles.rtl]}>
  //     <View>
  //       <Pressable
  //         onPress={() => {
  //           setLanguage(storageLanguage);
  //           setModalVisible(true);
  //         }}
  //       >
  //         <MenuIcon />
  //       </Pressable>
  //     </View>

  //     <Modal
  //       visible={modalVisible}
  //       animationType='fade'
  //       transparent
  //     >
  //       <View style={styles.modalOverlay}>
  //         <View style={[styles.modalContent, isDesktop && styles.modalContentDesktop]}>
  //           <View style={styles.modalHeader}>
  //             <Text style={styles.modalTitle}>{t('settings.title')}</Text>
  //             <Pressable onPress={() => setModalVisible(false)}>
  //               <XIcon
  //                 size={24}
  //                 color={Colors.text}
  //               />
  //             </Pressable>
  //           </View>

  //           <ScrollView
  //             style={styles.modalScroll}
  //             showsVerticalScrollIndicator={false}
  //           >
  //             <SelectPicker
  //               label={t('settings.language')}
  //               value={language}
  //               options={LANGUAGE_TYPE}
  //               onValueChange={value => setLanguage(value as LanguageType)}
  //             />

  //             <View style={styles.buttonRow}>
  //               <Button
  //                 title={t('common.save')}
  //                 onPress={handleSave}
  //                 loading={saving}
  //                 style={{ flex: 1 }}
  //               />
  //             </View>
  //             <View style={{ height: 40 }} />
  //           </ScrollView>
  //         </View>
  //       </View>
  //     </Modal>
  //   </View>
  // );
  return <Text>Settings</Text>;
}

const styles = StyleSheet.create({
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
    fontWeight: 600,
    color: Colors.text,
  },
  modalScroll: {
    padding: 20,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
  },
});
