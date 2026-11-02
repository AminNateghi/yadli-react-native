import { PlusIcon, WrenchIcon } from "lucide-react-native";
import { FlatList, StyleSheet, View } from "react-native";
import { Theme } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { EmptyState } from "@/components/EmptyState";
import { router } from "expo-router";
import { FloatButton } from "@/components/FloatButton";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { useVehicles } from "@/repositories/vehicle-repository";
import { VehicleRecordCard } from "@/components/VehicleRecordCard";
import { useGetProfile } from "@/repositories/profile-repository";

export default function VehiclesScreen() {
  const { t, isRTL } = useTranslation();
  const navigateOnce = useNavigationGuard();

  const { data: vehicles = [] } = useVehicles();
  const { data: profile } = useGetProfile();

  const activeVehicle = vehicles.find(
    (vehicle) => vehicle.id === profile?.activeVehicleId,
  );

  return (
    <View style={[styles.wrapper, isRTL && { direction: "rtl" }]}>
      <FloatButton
        icon={PlusIcon}
        text={t("vehicles.createTitle")}
        color={Theme.primary}
        placement={isRTL ? "left" : "right"}
        onPress={() => navigateOnce(() => router.push("/vehicles/form"))}
      />
      <FlatList
        style={styles.container}
        data={vehicles}
        keyExtractor={(vehicle) => String(vehicle.id)}
        renderItem={({ item: vehicle }) => (
          <VehicleRecordCard
            id={vehicle.id}
            vehicle={vehicle}
            rtl={isRTL}
            active={vehicle.id === activeVehicle?.id}
            onPress={(id) => {
              navigateOnce(() =>
                router.push({
                  pathname: "/vehicles/form",
                  params: { id },
                }),
              );
            }}
          />
        )}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={WrenchIcon}
            title={t("services.noServicesYet")}
            subtitle={t("services.servicesDescription")}
          />
        }
        ListFooterComponent={<View style={styles.listFooter} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  listFooter: {
    height: 100,
  },
});
