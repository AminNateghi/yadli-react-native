import {
  Modal as ModalNative,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "./Text";
import { Theme } from "@/constants";
import { XIcon } from "lucide-react-native";
import { type PropsWithChildren, useEffect, useState } from "react";

interface Props extends PropsWithChildren {
  visible: boolean;
  title?: string;
  onClose: () => void;
}

export default function Modal({ visible, title, onClose, children }: Props) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  return (
    <ModalNative
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <DialogBackdrop onClose={onClose}>
        <View style={styles.dialog}>
          {title && <DialogHeader title={title} onClose={onClose} />}

          {children}
        </View>
      </DialogBackdrop>
    </ModalNative>
  );
}

function DialogBackdrop({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <View style={styles.dialogOverlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      {children}
    </View>
  );
}

function DialogHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <View style={styles.dialogHeader}>
      <Text style={styles.dialogTitle}>{title}</Text>
      <Pressable onPress={onClose} accessibilityLabel="Close dialog">
        <XIcon size={21} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  dialogOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dialog: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 20,
    backgroundColor: Theme.background,
    elevation: 12,
    paddingBottom: 20,
  },
  dialogHeader: {
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Theme.text,
    flex: 1,
    marginRight: 12,
  },
});
