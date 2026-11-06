import { FuelIcon, PlusIcon } from "lucide-react-native";
import { FlatList, StyleSheet, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { ValueWithHelp } from "@/components/ValueWithHelp";
import { RecordCard } from "@/components/RecordCard";
import { Text } from "@/components/Text";
import { Theme, GlobalStyles } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { useFuels } from "@/repositories/fuel-repository";
import { useStatistics } from "@/repositories/statistics";
import { router, useNavigation } from "expo-router";
import { numberFormat } from "@/utils/number-format";
import { FloatButton } from "@/components/FloatButton";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { useLayoutEffect } from "react";
import { useActiveVehicle } from "@/repositories/active-vehicle";

export default function FuelScreen() {
  const { t, isRTL } = useTranslation();
  const navigateOnce = useNavigationGuard();
  const navigation = useNavigation();

  const { data: fuels } = useFuels();
  const { data: activeVehicle } = useActiveVehicle();
  const { statistics } = useStatistics();
  const intervalByTo = new Map(
    statistics.refueling.refuelingIntervals.map((interval) => [
      `${interval.toDate.getTime()}:${interval.toOdometer}`,
      interval,
    ]),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("menus.fuel"),
      headerLargeTitle: true,
      headerTitleAlign: "center",
    });
  });

  return (
    <View style={[styles.wrapper, isRTL && { direction: "rtl" }]}>
      {!activeVehicle?.sold && (
        <FloatButton
          icon={PlusIcon}
          text={t("fuel.createTitle")}
          color={Theme.orange}
          placement={isRTL ? "left" : "right"}
          onPress={() => navigateOnce(() => router.push("/fuel/form"))}
        />
      )}
      <FlatList
        style={styles.container}
        data={fuels ?? []}
        keyExtractor={(fuel) => String(fuel.id)}
        renderItem={({ item: fuel }) => {
          const interval = intervalByTo.get(
            `${fuel.date.getTime()}:${fuel.odometer}`,
          );
          const intervalDetails = interval
            ? [
                `${t("fuel.distanceSincePrevious")} ${numberFormat(interval.distanceKm, { isRTL })} ${t("common.km")}`,
                ...(interval.fuelConsumptionLPer100Km !== null
                  ? [
                      `${t("fuel.consumptionBetweenRefuels")} ${numberFormat(interval.fuelConsumptionLPer100Km, { isRTL })}`,
                    ]
                  : []),
              ]
            : [];

          return (
            <RecordCard
              id={fuel.id}
              title={`${numberFormat(fuel.liters, { isRTL })} ${t("common.liter")}`}
              date={fuel.date}
              amount={fuel.totalCost}
              help={t("common.priceSign")}
              subtitle={[...intervalDetails].join(" - ")}
              icon={FuelIcon}
              color={Theme.orange}
              rtl={isRTL}
              onPress={(id) => {
                navigateOnce(() =>
                  router.push({
                    pathname: "/fuel/form",
                    params: { id },
                  }),
                );
              }}
            />
          );
        }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={GlobalStyles.buttonRow}>
              {statistics.refueling.averageLiterPerKm > 0 && (
                <View style={styles.disPerLiterCard}>
                  <View>
                    <Text style={styles.disPerLiterValue}>
                      {numberFormat(statistics.refueling.averageLiterPerKm, {
                        isRTL,
                      })}{" "}
                      {t("common.liter")}
                    </Text>
                    <Text style={styles.disPerLiterLabel}>
                      {t("fuel.averageFuelEconomy")}
                    </Text>
                  </View>
                </View>
              )}

              {statistics.refueling.daysUntilNextRefueling !== null && (
                <View style={styles.predictionCard}>
                  <View>
                    <Text style={styles.predictionValue}>
                      {numberFormat(
                        statistics.refueling.daysUntilNextRefueling,
                        {
                          isRTL,
                        },
                      )}{" "}
                      {t("common.days")}
                    </Text>
                    <Text style={styles.predictionLabel}>
                      {t("fuel.nextRefuelingPrediction")}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {statistics.refueling.totalFuelCost > 0 && (
              <View style={GlobalStyles.summaryCard}>
                <Text style={GlobalStyles.summaryTitle}>
                  {t("fuel.totalFuelCost")}
                </Text>
                <ValueWithHelp
                  value={statistics.refueling.totalFuelCost}
                  help={t("common.priceSign")}
                  style={GlobalStyles.summaryValue}
                />
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          fuels?.length === 0 ? (
            <EmptyState
              icon={FuelIcon}
              title={t("fuel.noFuelRecords")}
              subtitle={t("fuel.fuelDescription")}
            />
          ) : undefined
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
  disPerLiterCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.success + 15,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    marginBottom: 16,
    flex: 1,
  },
  disPerLiterValue: {
    fontSize: 20,
    fontWeight: 700,
    color: Theme.success,
  },
  disPerLiterLabel: {
    fontSize: 13,
    color: Theme.textSecondary,
    marginTop: 2,
  },
  predictionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.orange + 15,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    marginBottom: 16,
    flex: 1,
  },
  predictionValue: {
    fontSize: 20,
    fontWeight: 700,
    color: Theme.orange,
  },
  predictionLabel: {
    fontSize: 13,
    color: Theme.textSecondary,
    marginTop: 2,
  },
});
