import { useState } from "react";
import Modal from "./Modal";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Theme } from "@/constants";
import { Text } from "./Text";
import { CheckIcon, ChevronDownIcon } from "lucide-react-native";
import { useTranslation } from "@/languages/useTranslation";
import {
  useSelectVehicle,
  useVehicles,
} from "@/repositories/vehicle-repository";
import { useGetProfile } from "@/repositories/profile-repository";
import { numberFormat } from "@/utils/number-format";
import { useStatistics } from "@/repositories/statistics";

export function SelectVehicle() {
  const { t, isRTL } = useTranslation();
  const [visible, setVisible] = useState(false);

  const { statistics } = useStatistics();
  const { data: vehicles = [] } = useVehicles();
  const { data: profile } = useGetProfile();
  const { mutate: selectVehicle } = useSelectVehicle();

  const activeVehicle = vehicles.find(
    (vehicle) => vehicle.id === profile?.activeVehicleId,
  );

  const handleSelectVehicle = (vehicleId: number) => {
    selectVehicle(vehicleId, {
      onSuccess: () => {
        setVisible(false);
      },
    });
  };

  return (
    <>
      <Pressable
        style={styles.btnSelect}
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={t("dashboard.selectVehicle")}
      >
        <View style={styles.btnContent}>
          <View style={styles.btnSelectContent}>
            <Text style={styles.carTitle}>{activeVehicle?.customName}</Text>
            <Text style={styles.carSubtitle}>
              {t("dashboard.latestOdometer")}
              {": "}
              {numberFormat(statistics.distance.latestOdometer, { isRTL })}
            </Text>
          </View>
          <ChevronDownIcon size={20} color={Theme.textSecondary} />
        </View>
      </Pressable>

      <Modal
        title={t("vehicles.selectVehicle")}
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <ScrollView style={styles.optionsList}>
          {vehicles.map((vehicle) => (
            <Pressable
              key={vehicle.id}
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
                vehicle.id === activeVehicle?.id && styles.optionSelected,
              ]}
              onPress={() => handleSelectVehicle(vehicle.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  vehicle.id === activeVehicle?.id && styles.optionTextSelected,
                ]}
              >
                {vehicle.customName}
              </Text>
              {vehicle.id === activeVehicle?.id && (
                <CheckIcon size={20} color={Theme.primary} />
              )}
            </Pressable>
          ))}
        </ScrollView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingRight: 24,
    paddingLeft: 24,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderLight,
  },
  optionPressed: {
    backgroundColor: Theme.surfaceAlt,
  },
  optionSelected: {
    backgroundColor: Theme.primary + 10,
  },
  optionText: {
    fontSize: Theme.fontSize,
    color: Theme.text,
  },
  optionTextSelected: {
    color: Theme.primary,
    fontWeight: 500,
  },

  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btnSelectContent: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flex: 1,
  },
  btnSelect: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 12,
    backgroundColor: Theme.surfaceAlt,

    gap: 10,
    flex: 1,
  },
  carTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: Theme.text,
  },
  carSubtitle: {
    fontSize: 14,
    color: Theme.textSecondary,
  },
});
