import { useRouter } from "expo-router";
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
import { EmptyState } from "@/components/EmptyState";
import { RecordCard } from "@/components/RecordCard";
import { StatCard } from "@/components/StatCard";
import { Text } from "@/components/Text";
import { Colors, globalStyles } from "@/constants/theme";
import { useTranslation } from "@/languages/useTranslation";
import { getExpenseTypeTitle, getServiceTypeTitle } from "@/types/interfaces";
import { useStatistics } from "@/repositories/statistics-repository";
import { useServices } from "@/repositories/service-repository";
import { useFuels } from "@/repositories/fuel-repository";
import { useExpenses } from "@/repositories/expense-repository";
import { MotiView } from "moti";

export default function DashboardScreen() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
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

  const { data: recentServices } = useServices();
  const { data: recentFuel } = useFuels();
  const { data: recentExpenses } = useExpenses();

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
              <MotiView
                from={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{
                  loop: true,
                  type: "timing",
                  duration: 1000,
                  delay: 200,
                }}
              >
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
              </MotiView>
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t("dashboard.recentFillUps")}
            </Text>
            <Pressable onPress={() => router.push("/fuel")}>
              <Text style={styles.seeAll}>{t("dashboard.seeAll")}</Text>
            </Pressable>
          </View>
          {recentFuel?.length === 0 ? (
            <EmptyState icon={FuelIcon} title={t("fuel.noFuelRecords")} />
          ) : (
            recentFuel
              ?.slice(0, 2)
              .map((fuel) => (
                <RecordCard
                  id={fuel.id}
                  key={fuel.id}
                  title={`${fuel.liters?.toFixed(1)} ${t("common.liter")}`}
                  date={fuel.date}
                  amount={fuel.totalCost}
                  icon={FuelIcon}
                  color={Colors.fuel}
                  rtl={isRTL}
                  onPress={() => router.push(`/fuel?edit=${fuel.id}`)}
                />
              ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t("dashboard.recentServices")}
            </Text>
            <Pressable onPress={() => router.push("/services")}>
              <Text style={styles.seeAll}>{t("dashboard.seeAll")}</Text>
            </Pressable>
          </View>
          {recentServices?.length === 0 ? (
            <EmptyState icon={WrenchIcon} title={t("services.noServicesYet")} />
          ) : (
            recentServices
              ?.slice(0, 2)
              .map((service) => (
                <RecordCard
                  id={service.id}
                  key={service.id}
                  title={getServiceTypeTitle(service.type, t)}
                  date={service.date}
                  amount={service.cost}
                  icon={WrenchIcon}
                  color={Colors.service}
                  rtl={isRTL}
                  onPress={() => router.push(`/services?edit=${service.id}`)}
                />
              ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t("dashboard.recentExpenses")}
            </Text>
            <Pressable onPress={() => router.push("/expenses")}>
              <Text style={styles.seeAll}>{t("dashboard.seeAll")}</Text>
            </Pressable>
          </View>
          {recentExpenses?.length === 0 ? (
            <EmptyState
              icon={BanknoteIcon}
              title={t("expenses.noExpenseYet")}
            />
          ) : (
            recentExpenses
              ?.slice(0, 2)
              .map((expense) => (
                <RecordCard
                  id={expense.id}
                  key={expense.id}
                  title={getExpenseTypeTitle(expense.type, t)}
                  date={expense.date}
                  amount={expense.amount}
                  icon={BanknoteIcon}
                  color={Colors.expense}
                  rtl={isRTL}
                  onPress={() => router.push(`/expenses?edit=${expense.id}`)}
                />
              ))
          )}
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
  section: {
    marginTop: 36,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 500,
  },
});
