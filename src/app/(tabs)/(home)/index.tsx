import { router, useNavigation } from "expo-router";
import {
  CarIcon,
  FuelIcon,
  BanknoteIcon,
  WrenchIcon,
  WalletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GaugeIcon,
  MenuIcon,
} from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { StatCard } from "@/components/StatCard";
import { Text } from "@/components/Text";
import { Theme, GlobalStyles } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { useStatistics } from "@/repositories/statistics";
import { useGetProfile } from "@/repositories/profile-repository";
import { useEffect, useLayoutEffect, useState } from "react";
import { Button } from "@/components/Button";
import { SelectVehicle } from "@/components/SelectVehicle";
import { useUpdateCheck } from "@/contexts/UpdateCheckContext";
import { CheckUpdate } from "@/components/CheckUpdate";
import { IconButton } from "@/components/IconButton";
import AppDrawer from "@/components/Drawer";

export default function DashboardScreen() {
  const { t, isRTL, currencySymbol, distanceUnit, fuelUnit } = useTranslation();
  const { totalReminders, statistics } = useStatistics();
  const { updateAvailable } = useUpdateCheck();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigation = useNavigation();

  const { data: profile } = useGetProfile();

  useLayoutEffect(() => {
    const handleShowDrawer = () => {
      setDrawerVisible(true);
    };

    navigation.setOptions({
      title: t("menus.dashboard"),
      headerTitleAlign: "center",
      headerLargeTitle: true,
      headerLeft: () =>
        isRTL ? (
          updateAvailable && <CheckUpdate type="icon" />
        ) : (
          <IconButton icon={MenuIcon} onPress={() => handleShowDrawer()} />
        ),
      headerRight: () =>
        isRTL ? (
          <IconButton icon={MenuIcon} onPress={() => handleShowDrawer()} />
        ) : (
          updateAvailable && <CheckUpdate type="icon" />
        ),
    });
  }, [navigation, t, isRTL, updateAvailable]);

  useEffect(() => {
    if (profile) {
      if (!profile.onboarding) {
        router.push("/(tabs)/(home)/onboarding");
      }
    }
  }, [profile]);

  return (
    <>
      <View style={[styles.wrapper, isRTL && GlobalStyles.rtl]}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <SelectVehicle />
            {totalReminders > 0 && (
              <Pressable onPress={() => router.push("/reminders")}>
                <View style={styles.nextService}>
                  <Text style={styles.reminderText}>
                    {t("reminders.overdue")}
                  </Text>
                  {isRTL ? (
                    <ChevronLeftIcon size={14} color={Theme.danger} />
                  ) : (
                    <ChevronRightIcon size={14} color={Theme.danger} />
                  )}
                </View>
              </Pressable>
            )}
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              title={t("dashboard.totalSpent")}
              value={statistics.general.totalSpent}
              help={currencySymbol}
              icon={WalletIcon}
              color={Theme.primary}
            />
            <StatCard
              title={t("dashboard.totalDistance")}
              value={statistics.distance.totalDistanceKm}
              help={distanceUnit}
              icon={CarIcon}
              color={Theme.primary}
            />
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              title={t("dashboard.fuelCosts")}
              value={statistics.refueling.totalFuelCost}
              help={currencySymbol}
              icon={FuelIcon}
              color={Theme.orange}
            />
            <StatCard
              title={t("dashboard.avgPerKm")}
              value={statistics.refueling.averageLiterPerKm}
              help={fuelUnit}
              icon={GaugeIcon}
              color={Theme.success}
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              title={t("dashboard.serviceCosts")}
              value={statistics.services.totalServiceCost}
              help={currencySymbol}
              icon={WrenchIcon}
              color={Theme.mulberry}
            />
            <StatCard
              title={t("dashboard.expenses")}
              value={statistics.expenses.totalExpenses}
              help={currencySymbol}
              icon={BanknoteIcon}
              color={Theme.violet}
            />
          </View>

          <Button
            title={`${t("reports.title")}...`}
            variant="plain"
            color="blue"
            onPress={() => router.push("/(tabs)/(home)/reports")}
          />

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>

      <AppDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  nextService: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Theme.danger + 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  reminderText: {
    fontSize: 11,
    fontWeight: 600,
    color: Theme.danger,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
});
