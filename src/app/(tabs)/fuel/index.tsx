import { FuelIcon, GaugeIcon, PlusIcon } from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { ValueWithHelp } from "@/components/ValueWithHelp";
import { RecordCard } from "@/components/RecordCard";
import { Text } from "@/components/Text";
import { Theme, GlobalStyles } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { useFuels } from "@/repositories/fuel-repository";
import { useStatistics } from "@/repositories/statistics";
import { router } from "expo-router";
import { Button } from "@/components/Button";
import { numberFormat } from "@/utils/number-format";
import { FloatButton } from "@/components/FloatButton";

export default function FuelScreen() {
  const { t, isRTL } = useTranslation();

  const { data: fuels } = useFuels();
  const { statistics } = useStatistics();

  return (
    <View style={[styles.wrapper, isRTL && { direction: "rtl" }]}>
      <FloatButton
        icon={PlusIcon}
        text={t("fuel.createTitle")}
        color="green"
        placement={isRTL ? "left" : "right"}
        onPress={() => router.push("/fuel/form")}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {statistics.refueling.averageLiterPerKm > 0 && (
          <View style={styles.disPerLiterCard}>
            <View style={styles.disPerLiterIconContainer}>
              <GaugeIcon size={20} color={Theme.success} />
            </View>
            <View>
              <Text style={styles.disPerLiterValue}>
                {numberFormat(statistics.refueling.averageLiterPerKm, {
                  isRTL,
                })}{" "}
                {t("fuel.kmPerLiter")}
              </Text>
              <Text style={styles.disPerLiterLabel}>
                {t("fuel.averageFuelEconomy")}
              </Text>
            </View>
          </View>
        )}

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

        {fuels?.length === 0 ? (
          <>
            <EmptyState
              icon={FuelIcon}
              title={t("fuel.noFuelRecords")}
              subtitle={t("fuel.fuelDescription")}
            />
            <Button
              title={t("common.new")}
              onPress={() => router.push("/fuel/form")}
              style={{ flex: 1 }}
            />
          </>
        ) : (
          fuels?.map((fuel) => {
            return (
              <RecordCard
                id={fuel.id}
                key={fuel.id}
                title={`${numberFormat(fuel.liters, { isRTL })} ${t("common.liter")}`}
                date={fuel.date}
                amount={fuel.totalCost}
                help={t("common.priceSign")}
                subtitle={`${numberFormat(fuel.odometer, { isRTL })} ${t("common.odometer")}`}
                icon={FuelIcon}
                color={Theme.fuel}
                rtl={isRTL}
                onPress={(id) => {
                  router.push({
                    pathname: "/fuel/form",
                    params: { id },
                  });
                }}
              />
            );
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
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
  disPerLiterCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.success + 15,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    marginBottom: 16,
  },
  disPerLiterIconContainer: {
    width: 44,
    height: 44,
    borderRadius: Theme.borderRadius,
    backgroundColor: Theme.success + 25,
    alignItems: "center",
    justifyContent: "center",
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
});
