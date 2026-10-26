import { FuelIcon, LeafIcon } from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { PriceValue } from "@/components/PriceValue";
import { RecordCard } from "@/components/RecordCard";
import { Text } from "@/components/Text";
import { Colors, GlobalStyles } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { useFuels } from "@/repositories/fuel-repository";
import { useStatistics } from "@/repositories/statistics-repository";
import { router } from "expo-router";
import { Button } from "@/components/Button";

export default function FuelScreen() {
  const { t, isRTL } = useTranslation();

  const { averageLiterPerKm } = useStatistics();

  const { data: fuels } = useFuels();
  const { totalFuelCost } = useStatistics();

  return (
    <View style={[styles.wrapper, isRTL && { direction: "rtl" }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {averageLiterPerKm > 0 && (
          <View style={styles.disPerLiterCard}>
            <View style={styles.disPerLiterIconContainer}>
              <LeafIcon size={20} color={Colors.success} />
            </View>
            <View>
              <Text style={styles.disPerLiterValue}>
                {averageLiterPerKm.toFixed(1)} {t("fuel.kmPerLiter")}
              </Text>
              <Text style={styles.disPerLiterLabel}>
                {t("fuel.averageFuelEconomy")}
              </Text>
            </View>
          </View>
        )}

        {totalFuelCost > 0 && (
          <View style={GlobalStyles.summaryCard}>
            <Text style={GlobalStyles.summaryTitle}>
              {t("fuel.totalFuelCost")}
            </Text>
            <PriceValue
              value={totalFuelCost?.toFixed(2)}
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
                title={`${fuel.liters?.toFixed(1)} ${t("common.liter")}`}
                date={fuel.date}
                amount={fuel.totalCost}
                subtitle={`${fuel.odometer} ${t("common.km")}`}
                icon={FuelIcon}
                color={Colors.fuel}
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
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.success + 15,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    marginBottom: 16,
  },
  disPerLiterIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.success + 25,
    alignItems: "center",
    justifyContent: "center",
  },
  disPerLiterValue: {
    fontSize: 20,
    fontWeight: 700,
    color: Colors.success,
  },
  disPerLiterLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
