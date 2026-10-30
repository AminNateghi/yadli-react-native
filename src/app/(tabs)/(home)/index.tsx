import { router } from "expo-router";
import {
  CarIcon,
  FuelIcon,
  BanknoteIcon,
  WrenchIcon,
  WalletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GaugeIcon,
} from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { StatCard } from "@/components/StatCard";
import { Text } from "@/components/Text";
import { Colors, GlobalStyles } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { useStatistics } from "@/repositories/statistics";
import { useGetProfile } from "@/repositories/profile-repository";
import { useEffect } from "react";
import { numberFormat } from "@/utils/number-format";
import { Button } from "@/components/Button";

export default function DashboardScreen() {
  const { t, isRTL } = useTranslation();
  const { totalReminders, statistics } = useStatistics();

  const { data: profile } = useGetProfile();

  useEffect(() => {
    if (profile) {
      if (!profile.onboarding) {
        router.push("/(tabs)/(home)/onboarding");
      }
    }
  }, [profile]);

  return (
    <View style={[styles.wrapper, isRTL && GlobalStyles.rtl]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.carInfo}>
            <View style={styles.carIconContainer}>
              <CarIcon size={24} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.carTitle}>{t("dashboard.myVehicle")}</Text>
              <Text style={styles.carSubtitle}>
                {t("dashboard.latestOdometer")}
                {": "}
                {numberFormat(statistics.distance.latestOdometer, {
                  isRTL,
                })}{" "}
              </Text>
            </View>
          </View>
          {totalReminders > 0 && (
            <Pressable onPress={() => router.push("/reminders")}>
              <View style={styles.nextService}>
                <Text style={styles.reminderText}>
                  {t("reminders.overdue")}
                </Text>
                {isRTL ? (
                  <ChevronLeftIcon size={14} color={Colors.danger} />
                ) : (
                  <ChevronRightIcon size={14} color={Colors.danger} />
                )}
              </View>
            </Pressable>
          )}
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title={t("dashboard.totalSpent")}
            value={statistics.general.totalSpent}
            help={t("common.priceSign")}
            icon={WalletIcon}
            color={Colors.primary}
          />
          <StatCard
            title={t("dashboard.totalDistance")}
            value={statistics.distance.totalDistanceKm}
            help={t("common.kilometer")}
            icon={CarIcon}
            color={Colors.primary}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title={t("dashboard.fuelCosts")}
            value={statistics.refueling.totalFuelCost}
            help={t("common.priceSign")}
            icon={FuelIcon}
            color={Colors.fuel}
          />
          <StatCard
            title={t("dashboard.avgPerKm")}
            value={statistics.refueling.averageLiterPerKm}
            help={t("common.liter")}
            icon={GaugeIcon}
            color={Colors.success}
          />
        </View>
        <View style={styles.statsGrid}>
          <StatCard
            title={t("dashboard.serviceCosts")}
            value={statistics.services.totalServiceCost}
            help={t("common.priceSign")}
            icon={WrenchIcon}
            color={Colors.service}
          />
          <StatCard
            title={t("dashboard.expenses")}
            value={statistics.expenses.totalExpenses}
            help={t("common.priceSign")}
            icon={BanknoteIcon}
            color={Colors.expense}
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
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background,
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
    marginBottom: 20,
  },
  carInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  carIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary + 15,
    alignItems: "center",
    justifyContent: "center",
  },
  carTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: Colors.text,
  },
  carSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  nextService: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.danger + 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  reminderText: {
    fontSize: 11,
    fontWeight: 600,
    color: Colors.danger,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
});
