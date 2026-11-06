import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { Theme } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { StyleSheet, View } from "react-native";
import { Card } from "./Card";

interface SoldVehicleNoticeProps {
  onClose: () => void;
}

export function SoldVehicleNotice({ onClose }: SoldVehicleNoticeProps) {
  const { t, isRTL } = useTranslation();

  return (
    <View style={[styles.container, isRTL && { direction: "rtl" }]}>
      <Card style={styles.card}>
        <Text style={styles.message}>{t("vehicles.soldRecordsLocked")}</Text>
      </Card>
      <Button title={t("common.close")} onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: Theme.background,
  },
  card: {
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});
