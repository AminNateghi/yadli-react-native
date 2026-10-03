import { format } from "date-fns";
import { PlusIcon, XIcon } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useMediaQuery } from "react-responsive";

import { Colors, globalStyles } from "@/constants/theme";
import {
  useCreateService,
  useDoneService,
  useUpdateService,
} from "@/contexts/service-repository";
import { useTranslation } from "@/languages/useTranslation";
import {
  type ServiceDto,
  type ServiceType,
  serviceTypeOptions,
} from "@/types/interfaces";
import { Button } from "../Button";
import { Toast } from "../CustomToast";
import { DatePicker } from "../DatePicker";
import { Input } from "../Input";
import { SelectPicker } from "../SelectPicker";
import { Text } from "../Text";
import { ServiceDeletionModal } from "./ServiceDeletionModal";

type Props = {
  editingId: number;
  visible: boolean;
};

export function ServiceForm({ editingId, visible = false }: Props) {
  const { t, isRTL } = useTranslation();
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);

  const [type, setType] = useState<ServiceType>("EngineOil");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [odometer, setOdometer] = useState("");
  const [cost, setCost] = useState("");
  const [note, setNote] = useState<string>("");
  const [nextDueDate, setNextDueDate] = useState<string>("");
  const [nextDueOdometer, setNextDueOdometer] = useState<string>("");

  const { mutate: updateService, isPending: isPendingUpdate } =
    useUpdateService(editingId);
  const { mutate: doneService } = useDoneService();
  const { mutate: createService, isPending: isPendingCreate } =
    useCreateService();

  const resetForm = () => {
    setType("EngineOil");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setOdometer("");
    setCost("");
    setNote("");
    setNextDueDate("");
    setNextDueOdometer("");
  };

  const handleDelete = async () => {
    if (!editingId) return;
    setIsConfirmDelete(true);
  };

  const handleSave = async () => {
    if (!odometer || !cost) {
      Toast({ text: t("services.confirmValidation") });
      return;
    }

    try {
      const data: Omit<ServiceDto, "id"> = {
        type,
        date,
        odometer: Number(odometer),
        cost: parseFloat(cost),
        note: note ?? null,
        nextDueDate: nextDueDate ?? null,
        nextDueOdometer: Number(nextDueOdometer) ?? null,
        createdAt: null,
        updatedAt: null,
      };

      if (editingId) {
        updateService(data, {
          onSuccess: () => {
            Toast({ text: "Saved" });
          },
        });
      } else {
        // first clear prev service warning
        doneService(type);
        //  add service
        createService(data);
      }

      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.warn("Error saving service:", error);
    }
  };

  return (
    <>
      <View
        style={[
          isRTL ? globalStyles.fabContainerRTL : globalStyles.fabContainer,
          isDesktop && globalStyles.fabContainerDesktop,
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            globalStyles.fab,
            pressed && globalStyles.fabPressed,
          ]}
          onPress={() => setModalVisible(true)}
        >
          <PlusIcon size={24} color="#FFFFFF" />
        </Pressable>
      </View>
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              isDesktop && styles.modalContentDesktop,
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId
                  ? t("services.updateTitle")
                  : t("services.createTitle")}
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <XIcon size={24} color={Colors.text} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <SelectPicker
                label={t("services.serviceType")}
                value={type}
                options={serviceTypeOptions(t)}
                onValueChange={(value) => setType(value as ServiceType)}
              />

              <DatePicker
                label={t("services.date")}
                value={date}
                onChange={setDate}
              />

              <Input
                label={t("services.odometer")}
                value={odometer}
                onChangeText={setOdometer}
                keyboardType="numeric"
                placeholder={t("services.odometerPlaceholder")}
              />

              <Input
                label={t("services.cost")}
                value={cost}
                onChangeText={setCost}
                keyboardType="decimal-pad"
                placeholder={t("services.costPlaceholder")}
              />

              <Input
                label={t("services.note")}
                value={note}
                onChangeText={setNote}
                placeholder={t("services.notePlaceholder")}
                multiline
                style={{ height: 80, textAlignVertical: "top", paddingTop: 12 }}
              />

              <Text>{t("services.nextServiceDue")}</Text>

              <DatePicker
                label={t("services.nextDueDate")}
                value={nextDueDate}
                onChange={setNextDueDate}
              />

              <Input
                label={t("services.nextDueOdometer")}
                value={nextDueOdometer}
                onChangeText={setNextDueOdometer}
                keyboardType="numeric"
                placeholder={t("services.nextDueOdometerPlaceholder")}
              />

              <View style={styles.buttonRow}>
                {editingId && (
                  <Button
                    title={t("common.delete")}
                    variant="danger"
                    onPress={handleDelete}
                    style={{ flex: 1 }}
                  />
                )}
                <Button
                  title={editingId ? t("common.update") : t("common.save")}
                  onPress={handleSave}
                  loading={isPendingUpdate || isPendingCreate}
                  style={{ flex: 1 }}
                />
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
      <ServiceDeletionModal editingId={editingId} visible={isConfirmDelete} />
    </>
  );
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
    fontWeight: "600",
    color: Colors.text,
  },
  modalScroll: {
    padding: 20,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
  },
});
