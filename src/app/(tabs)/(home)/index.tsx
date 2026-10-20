import { router } from "expo-router";
import {
  CarIcon,
  FuelIcon,
  BanknoteIcon,
  WrenchIcon,
  WalletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useMediaQuery } from "react-responsive";
import { StatCard } from "@/components/StatCard";
import { Text } from "@/components/Text";
import { Colors, globalStyles } from "@/constants/theme";
import { useTranslation } from "@/languages/useTranslation";
import { useStatistics } from "@/repositories/statistics-repository";
import { useGetProfile } from "@/repositories/profile-repository";
import { useEffect } from "react";

export default function DashboardScreen() {
  const { t, isRTL } = useTranslation();
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const {
    totalFuelCost,
    totalExpenses,
    totalKm,
    totalServiceCost,
    totalSpent,
    totalReminders,
    expenseRecordsLength,
    fuelRecordsLength,
    serviceRecordsLength,
  } = useStatistics();

  const { data: profile } = useGetProfile();

  useEffect(() => {
    if (profile) {
      if (!profile.onboarding) {
        router.push("/(tabs)/(home)/onboarding");
      }
    }
  }, [profile]);

  return (
    <View style={[styles.wrapper, isRTL && globalStyles.rtl]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          isDesktop && styles.contentDesktop,
        ]}
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
                {totalKm?.toLocaleString()} {t("common.kilometer")}
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

        <View style={[styles.statsGrid, isDesktop && styles.statsGridDesktop]}>
          <StatCard
            title={t("dashboard.totalSpent")}
            value={`${totalSpent.toFixed(0)}`}
            subtitle={t("dashboard.allTime")}
            icon={WalletIcon}
            color={Colors.primary}
          />
          <StatCard
            title={t("dashboard.fuelCosts")}
            value={`${totalFuelCost.toFixed(0)}`}
            subtitle={`${fuelRecordsLength} ${t("dashboard.fillUps")}`}
            icon={FuelIcon}
            color={Colors.fuel}
          />
        </View>

        <View style={[styles.statsGrid, isDesktop && styles.statsGridDesktop]}>
          <StatCard
            title={t("dashboard.serviceCosts")}
            value={`${totalServiceCost.toFixed(0)}`}
            subtitle={`${serviceRecordsLength} ${t("dashboard.servicesCount")}`}
            icon={WrenchIcon}
            color={Colors.service}
          />
          <StatCard
            title={t("dashboard.expenses")}
            value={`${totalExpenses.toFixed(0)}`}
            subtitle={`${expenseRecordsLength} ${t("dashboard.records")}`}
            icon={BanknoteIcon}
            color={Colors.expense}
          />
        </View>

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
  contentDesktop: {
    maxWidth: 1024,
    alignSelf: "center",
    width: "100%",
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
    backgroundColor: Colors.primary + "15",
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
    backgroundColor: Colors.danger + "15",
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
  statsGridDesktop: {
    maxWidth: 600,
  },
});
